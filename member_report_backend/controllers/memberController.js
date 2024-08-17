const pool = require("../utils/connectToDb")

exports.getAMemberDetails = async(req,res) => {
    const PrvCusID=req.params.id;
    let memberInfo = await(await pool.request().query(`select * from CustomerMst where PrvCusID='${PrvCusID}'`)).recordset[0]
    const memberInfoDetail = await(await pool.request().query(`select * from CustomerMst_MoreChildren where PrvCusID='${PrvCusID}'`)).recordset[0]
    memberInfo = {...memberInfo, ...memberInfoDetail}

    const fatherId = memberInfo.FatherPrvcusid;
    const brothers_one_to_four = await(await pool.request().query(`select Child1, Child2, Child3, Child4 from CustomerMst where PrvCusID='${fatherId}'`)).recordset[0]
    const brothers_five_to_ten = await(await pool.request().query(`select Child5, Child6, Child7, Child8, Child9, Child10 from CustomerMst_MoreChildren where PrvCusID='${fatherId}'`)).recordset[0]
    let brothers = {...brothers_one_to_four, ...brothers_five_to_ten};
    brothers = Object.values(brothers).filter(item => {
        if(item!=='0' && item !==memberInfo.CusName){
            return true
        }
    })
    let children = [memberInfo.Child1,memberInfo.Child2, memberInfo.Child3, memberInfo.Child4, memberInfo.Child5, memberInfo.Child6, memberInfo.Child7, memberInfo.Child8, memberInfo.Child9, memberInfo.Child10]
    // console.log(children)
    children = children.filter(item => {
        if(item !=='0' && item!== undefined){
            return true;
        }
    })
    console.log(children)
    const grandfather = await(await pool.request().query(`select FatherName from CustomerMst where PrvCusID='${fatherId}'`)).recordset[0]
    const member = await (await pool.request().input('PrvcusID', PrvCusID).execute('FindRelatives')).recordset
    const filterMember = member.filter(item => {
        if(item.RelativeID!=='0'){
            return true;
        }
    })

    const blankArr=[]
    if(memberInfo.PrvcusID_Spo1){
        filterMember.push({Relation:'Spouse', RelativeID:memberInfo.PrvcusID_Spo1, name: memberInfo.CusName})
    }

    filterMember.forEach((item) => {
        const findIndex = blankArr.findIndex(el => el.Relation===item.Relation)
        if(findIndex!==-1){
            const findObj = blankArr[findIndex]
            findObj.RelativeID = [...findObj.RelativeID, item.RelativeID]
        }else {
            blankArr.push({...item,RelativeID:[item.RelativeID] })
        }
    })

    const f = await Promise.all(blankArr.map(async (mainItem, index) => {
        const cArr= await Promise.all(mainItem.RelativeID.map(async item => {
            const singleItem = (await pool.request().query(`select * from CustomerMst where PrvCusID='${item}'`)).recordset[0];
            return singleItem || item
        }))
        return {
            [mainItem.Relation]: cArr
        }
    }))
    const myObj = {};
    
    f.forEach(item => {
        myObj[Object.keys(item)[0]] = Object.values(item)[0]
    })
    res.status(200).json({
        status:'Success', 
        data: {
            data: {
                ...myObj,
                Children: children,
                grandfather: grandfather,
                Father: memberInfo.FatherName,
                Spouse: memberInfo.SpouseName,
                brothers: brothers,
                mother: memberInfo.MotherName
            }
        }
    })
}

exports.getAllMembers = async(req,res) => {
    const Mobile = req.query.Mobile?req.query.Mobile:null
    const RowPerPage = req.query.RowPerPage?req.query.RowPerPage:10
    const PageNumber = req.query.PageNumber?req.query.PageNumber:1
    const PrvCusID = req.query.PrvCusID?req.query.PrvCusID:null;
    const CusName = req.query.CusName?req.query.CusName:null;
    const results = await pool.request().input('RowPerPage',RowPerPage).input('PageNumber',PageNumber).input('Mobile',Mobile).input('CusName', CusName).input('PrvCusID',PrvCusID).output('TotalPages').output('TotalDocuments').execute('spSelectMembers');
    res.status(200).json({
        status:'Success',
        data: {
            data: results.recordset
        }
    })
}