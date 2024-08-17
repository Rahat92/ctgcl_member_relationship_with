USE [DePos_ERP_UCL]
GO
/****** Object:  StoredProcedure [dbo].[spSelectMembers]    Script Date: 08/04/2024 12:10:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER proc [dbo].[spSelectMembers] @RowPerPage int = null, @PageNumber int=null, @Mobile varchar(11) = null, @Email varchar(20)=null, @TotalPages INT OUTPUT, @TotalDocuments INT OUTPUT, @Prvcusid nvarchar(10)=null, @CusName nvarchar(50)
as
--IF (@RowPerPage IS NOT NULL) AND (@PageNumber IS NOT NULL)
begin
DECLARE @TotalRows INT
SELECT @TotalRows = COUNT(*) from  CustomerMst where (@CusName is null or CusName = @CusName) and (@Mobile is null or Mobile like '%' +@Mobile+ '%') and (@Prvcusid is null or PrvCusID like '%'+@Prvcusid+'%') and (@Email is null or Email like '%'+@Email+'%');
SET @TotalDocuments = @TotalRows;
SET @TotalPages = CEILING(CONVERT(DECIMAL(10,2), @TotalRows)/@RowPerPage);

WITH SearchResults AS (
    SELECT *,
           ROW_NUMBER() OVER (ORDER BY PrvCusID desc) AS RowNum
    FROM  CustomerMst WHERE (@CusName is null or CusName = @CusName) and (@Mobile is null or Mobile like '%' +@Mobile+ '%') and (@Prvcusid is null or PrvCusID like '%'+@Prvcusid+'%') and (@Email is null or Email like '%'+@Email+'%')
)

SELECT *
FROM SearchResults
WHERE (@CusName is null or CusName = @CusName) and (@Mobile is null or Mobile like '%' +@Mobile+ '%') and (@Prvcusid is null or PrvCusID like '%'+@Prvcusid+'%') and (@Email is null or Email like '%'+@Email+'%') AND RowNum BETWEEN (@PageNumber - 1) * @RowPerPage + 1 AND @PageNumber * @RowPerPage;
end