USE [DePos_ERP_UCL]
GO
/****** Object:  StoredProcedure [dbo].[GetMemberRelationships]    Script Date: 08/04/2024 1:51:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[GetMemberRelationships]
    @PrvcusID NVARCHAR(50)
AS
BEGIN
    -- Declare a temporary table to store relationships
    DECLARE @Relationships TABLE (
        MemberPrvcusID NVARCHAR(50),
        RelatedMemberPrvcusID NVARCHAR(50),
        RelationshipType NVARCHAR(50)
    );

    -- Add direct children
    INSERT INTO @Relationships (MemberPrvcusID, RelatedMemberPrvcusID, RelationshipType)
    SELECT 
        @PrvcusID,
        PrvcusID_Ch1,
        'Child'
    FROM CustomerMstCopy
    WHERE PrvcusID = @PrvcusID AND PrvcusID_Ch1 IS NOT NULL
    UNION ALL
    SELECT 
        @PrvcusID,
        PrvcusID_Ch2,
        'Child'
    FROM CustomerMstCopy
    WHERE PrvcusID = @PrvcusID AND PrvcusID_Ch2 IS NOT NULL
    UNION ALL
    SELECT 
        @PrvcusID,
        PrvcusID_Ch3,
        'Child'
    FROM CustomerMstCopy
    WHERE PrvcusID = @PrvcusID AND PrvcusID_Ch3 IS NOT NULL
    UNION ALL
    SELECT 
        @PrvcusID,
        PrvcusID_Ch4,
        'Child'
    FROM CustomerMstCopy
    WHERE PrvcusID = @PrvcusID AND PrvcusID_Ch4 IS NOT NULL;

    -- Add direct spouses
    INSERT INTO @Relationships (MemberPrvcusID, RelatedMemberPrvcusID, RelationshipType)
    SELECT 
        @PrvcusID,
        PrvcusID_Spo1,
        'Spouse'
    FROM CustomerMstCopy
    WHERE PrvcusID = @PrvcusID AND PrvcusID_Spo1 IS NOT NULL
    UNION ALL
    SELECT 
        @PrvcusID,
        PrvcusID_Spo2,
        'Spouse'
    FROM CustomerMstCopy
    WHERE PrvcusID = @PrvcusID AND PrvcusID_Spo2 IS NOT NULL;

    -- Add father
    INSERT INTO @Relationships (MemberPrvcusID, RelatedMemberPrvcusID, RelationshipType)
    SELECT 
        @PrvcusID,
        ParentID,
        'Father'
    FROM CustomerMstCopy
    WHERE PrvcusID = @PrvcusID AND ParentID IS NOT NULL;

    -- Add grandparents
    INSERT INTO @Relationships (MemberPrvcusID, RelatedMemberPrvcusID, RelationshipType)
    SELECT 
        @PrvcusID,
        GrandID,
        'Grandparent'
    FROM CustomerMstCopy
    WHERE PrvcusID = @PrvcusID AND GrandID IS NOT NULL;

    -- Add siblings (sharing the same parent)
    INSERT INTO @Relationships (MemberPrvcusID, RelatedMemberPrvcusID, RelationshipType)
    SELECT 
        s1.PrvcusID AS MemberPrvcusID,
        s2.PrvcusID AS RelatedMemberPrvcusID,
        'Sibling'
    FROM CustomerMstCopy s1
    INNER JOIN CustomerMstCopy s2 ON s1.ParentID = s2.ParentID
    WHERE s1.PrvcusID <> s2.PrvcusID
      AND s1.PrvcusID = @PrvcusID;

    -- Add grandchildren using a recursive CTE
    WITH CTE_Children AS (
        SELECT 
            PrvcusID AS ParentPrvcusID,
            PrvcusID_Ch1 AS ChildPrvcusID
        FROM CustomerMstCopy
        WHERE PrvcusID_Ch1 IS NOT NULL
        UNION ALL
        SELECT 
            PrvcusID AS ParentPrvcusID,
            PrvcusID_Ch2 AS ChildPrvcusID
        FROM CustomerMstCopy
        WHERE PrvcusID_Ch2 IS NOT NULL
        UNION ALL
        SELECT 
            PrvcusID AS ParentPrvcusID,
            PrvcusID_Ch3 AS ChildPrvcusID
        FROM CustomerMstCopy
        WHERE PrvcusID_Ch3 IS NOT NULL
        UNION ALL
        SELECT 
            PrvcusID AS ParentPrvcusID,
            PrvcusID_Ch4 AS ChildPrvcusID
        FROM CustomerMstCopy
        WHERE PrvcusID_Ch4 IS NOT NULL
    ),
    CTE_Relationships AS (
        -- Anchor member (start from the given PrvcusID)
        SELECT 
            @PrvcusID AS MemberPrvcusID,
            ChildPrvcusID,
            CAST('Child' AS NVARCHAR(50)) AS RelationshipType,
            1 AS Level
        FROM CTE_Children
        WHERE ParentPrvcusID = @PrvcusID

        UNION ALL

        -- Recursive member (traverse down to find grandchildren)
        SELECT 
            r.MemberPrvcusID,
            c.ChildPrvcusID,
            CAST('Grandchild' AS NVARCHAR(50)) AS RelationshipType,
            Level + 1
        FROM CTE_Relationships r
        JOIN CTE_Children c ON r.ChildPrvcusID = c.ParentPrvcusID
    )
    INSERT INTO @Relationships (MemberPrvcusID, RelatedMemberPrvcusID, RelationshipType)
    SELECT MemberPrvcusID, ChildPrvcusID, RelationshipType
    FROM CTE_Relationships
    WHERE RelationshipType = 'Grandchild';

    -- Add uncles and aunts (siblings of parents)
    INSERT INTO @Relationships (MemberPrvcusID, RelatedMemberPrvcusID, RelationshipType)
    SELECT 
        p.PrvcusID AS MemberPrvcusID,
        s.PrvcusID AS RelatedMemberPrvcusID,
        CASE 
            WHEN s.Sex = 'M' THEN 'Uncle'
            ELSE 'Aunt'
        END AS RelationshipType
    FROM CustomerMstCopy p
    INNER JOIN CustomerMstCopy s ON p.ParentID = s.ParentID
    LEFT JOIN CustomerMstCopy c ON p.PrvcusID = @PrvcusID
    WHERE c.ParentID IS NOT NULL AND s.PrvcusID <> p.PrvcusID;

    -- Add nephews and nieces (children of siblings of the member)
    INSERT INTO @Relationships (MemberPrvcusID, RelatedMemberPrvcusID, RelationshipType)
    SELECT 
        s.PrvcusID AS MemberPrvcusID,
        c.PrvcusID AS RelatedMemberPrvcusID,
        CASE 
            WHEN c.Sex = 'M' THEN 'Nephew'
            ELSE 'Niece'
        END AS RelationshipType
    FROM CustomerMstCopy p
    INNER JOIN CustomerMstCopy s ON p.ParentID = s.ParentID
    INNER JOIN CustomerMstCopy c ON s.PrvcusID = c.ParentID
    WHERE p.PrvcusID = @PrvcusID;

    -- Return the relationships for the specific member
    SELECT * FROM @Relationships;
END;