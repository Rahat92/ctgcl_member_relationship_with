const fs = require("fs");
const puppeteer = require("puppeteer");
const pool = require("../utils/connectToDb");
const path = require('path')
exports.generateReport = async (req, res) => {
    const PrvCusID=req.params.id;
    let memberInfo = await(await pool.request().query(`select * from CustomerMst where PrvCusID='${PrvCusID}'`)).recordset[0]
    const memberInfoDetail = await(await pool.request().query(`select * from CustomerMst_MoreChildren where PrvCusID='${PrvCusID}'`)).recordset[0]
    memberInfo = {...memberInfo, ...memberInfoDetail}
    const fatherId = memberInfo.FatherPrvcusid;
    const motherId = memberInfo.MotherPrvcusid;
    const childrenIds = [
      memberInfo.Child1Prvcusid,
      memberInfo.Child2Prvcusid,
      memberInfo.Child3Prvcusid,
      memberInfo.Child4Prvcusid,
      memberInfo.Child5Prvcusid,
      memberInfo.Child6Prvcusid,
      memberInfo.Child7Prvcusid,
      memberInfo.Child8Prvcusid,
      memberInfo.Child9Prvcusid,
      memberInfo.Child10Prvcusid,
    ].filter((item) => {
      if(item!='0' && item!==undefined && item!==''){
        return true
      }
    })
    console.log(childrenIds)

    let grandChildrenInfos = [];
    if(childrenIds.length>0){
      const queryString = childrenIds.join(`' or PrvCusID='`)
      console.log(queryString)
      const childrenInfo = (await pool.request().query(`select * from CustomerMst where PrvCusID='${queryString}' `)).recordset
      const childrenInfoDetail = await (await pool.request().query(`select * from CustomerMst_MoreChildren where PrvCusID='${queryString}' `)).recordset
      console.log(36, childrenInfoDetail)
      const granchildren = childrenInfo.map((item, index) => {
        console.log('item ', item)
        return {
          child1: `${childrenInfoDetail[index].Child1Prvcusid}@${item.Child1}`,
          child2: `${childrenInfoDetail[index].Child2Prvcusid}@${item.Child2}`,
          child3: `${childrenInfoDetail[index].Child3Prvcusid}@${item.Child3}`,
          child4: `${childrenInfoDetail[index].Child4Prvcusid}@${item.Child4}`,
          child5: `${childrenInfoDetail[index].Child5Prvcusid}@${childrenInfoDetail[index].Child5}`,
          child6: `${childrenInfoDetail[index].Child6Prvcusid}@${childrenInfoDetail[index].Child6}`,
          child7: `${childrenInfoDetail[index].Child7Prvcusid}@${childrenInfoDetail[index].Child7}`,
          child8: `${childrenInfoDetail[index].Child8Prvcusid}@${childrenInfoDetail[index].Child8}`,
          child9: `${childrenInfoDetail[index].Child9Prvcusid}@${childrenInfoDetail[index].Child9}`,
          child10: `${childrenInfoDetail[index].Child10Prvcusid}@${childrenInfoDetail[index].Child10}`
        }
      })
      // console.log(51,granchildren)
      granchildren.forEach(item => {
        grandChildrenInfos.push(item.child1,item.child2,item.child3,item.child4,item.child5,item.child6,item.child7,item.child8,item.child9,item.child10)
      })
      grandChildrenInfos = grandChildrenInfos.filter(item => item.length>5)
    }
    let grandFatherDetail;
    if(fatherId){
      grandFatherDetail = await pool.request().query(`select * from CustomerMst_MoreChildren where Child1Prvcusid = '${fatherId}' or Child2Prvcusid = '${fatherId}' or Child3Prvcusid = '${fatherId}' or Child4Prvcusid = '${fatherId}' or Child5Prvcusid = '${fatherId}' or Child6Prvcusid = '${fatherId}' or Child6Prvcusid = '${fatherId}' or Child6Prvcusid = '${fatherId}' or Child7Prvcusid = '${fatherId}' or Child8Prvcusid = '${fatherId}' or Child9Prvcusid = '${fatherId}' or Child10Prvcusid = '${fatherId}'`)
      grandFatherDetail = grandFatherDetail.recordset;
      grandFatherDetail= grandFatherDetail[0]
    }
    let grandfatherInfo;
    if(grandFatherDetail){
      grandfatherInfo = await (await pool.request().query(`select * from CustomerMst where PrvCusID='${grandFatherDetail.PrvCusID}'`)).recordset[0]
    }
    let uncles = [];
    if(grandFatherDetail){
      uncles = [`${grandFatherDetail.Child1Prvcusid}@${grandfatherInfo.Child1}`,
        `${grandFatherDetail.Child2Prvcusid}@${grandfatherInfo.Child2}`,
        `${grandFatherDetail.Child3Prvcusid}@${grandfatherInfo.Child3}`,
        `${grandFatherDetail.Child4Prvcusid}@${grandfatherInfo.Child4}`,
        `${grandFatherDetail.Child5Prvcusid}@${grandfatherInfo.Child5}`,
        `${grandFatherDetail.Child6Prvcusid}@${grandfatherInfo.Child6}`,
        `${grandFatherDetail.Child7Prvcusid}@${grandfatherInfo.Child7}`,
        `${grandFatherDetail.Child8Prvcusid}@${grandfatherInfo.Child8}`,
        `${grandFatherDetail.Child9Prvcusid}@${grandfatherInfo.Child9}`,
        `${grandFatherDetail.Child10Prvcusid}@${grandfatherInfo.Child10}`
       ].filter(item => {
         if(item.split('@')[0]&&item.split('@')[0]!=fatherId){
           return true   
         }
       })
    }
    const brothers_one_to_four = await(await pool.request().query(`select Child1, Child2, Child3, Child4 from CustomerMst where PrvCusID='${fatherId}'`)).recordset[0]
    const brothers_five_to_ten = await(await pool.request().query(`select Child5, Child1Prvcusid, Child2Prvcusid, Child3Prvcusid, Child4Prvcusid, Child5Prvcusid, Child5Prvcusid, Child6Prvcusid, Child7Prvcusid, Child8Prvcusid, Child9Prvcusid, Child10Prvcusid, Child6, Child7, Child8, Child9, Child10 from CustomerMst_MoreChildren where PrvCusID='${fatherId}'`)).recordset[0]
    let brothers = {...brothers_one_to_four, ...brothers_five_to_ten};
    // brothers = Object.values(brothers).filter(item => {
    //     console.log(item)
    //     if(item!=='0' && item !==memberInfo.CusName){
    //         return true
    //     }
    // })
    brothers = [brothers.Child1 + '@'+ brothers.Child1Prvcusid,
                 brothers.Child2 + '@'+ brothers.Child2Prvcusid,
                 brothers.Child3 + '@'+ brothers.Child3Prvcusid,
                 brothers.Child4 + '@'+ brothers.Child4Prvcusid,
                 brothers.Child5 + '@'+ brothers.Child5Prvcusid,
                 brothers.Child6 + '@'+ brothers.Child6Prvcusid,
                 brothers.Child7 + '@'+ brothers.Child7Prvcusid,
                 brothers.Child8 + '@'+ brothers.Child8Prvcusid,
                 brothers.Child9 + '@'+ brothers.Child9Prvcusid,
                 brothers.Child10 + '@'+ brothers.Child10Prvcusid,
            ].filter(item => {
                if(item.split('@')[0]!=='0' && item!== 'undefined@undefined' && item.split('@')[1]!=memberInfo.PrvCusID){
                    return true 
                }
            })
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
    const uppercaseWords = str => (str || ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
    try {
        // Launch a Puppeteer browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        // Define the content or URL to convert to PDF
        const htmlContent = `
  <html>
    <style>
      table {
        border-collapse: collapse;
        width: 100%;
      }
      tr{
        padding: .5rem 0;
      }
      td {
        border: 1px solid black;
        padding: 0 .5rem;
        padding-left: 1rem;
        font-weight: 600;
        font-size: 18px;
      }
      table table td {
        border: none;
        padding: 0;
      }
      table tbody tr td:nth-child(2), table thead tr td:nth-child(2) {
          padding-left: .5rem;
      }
      table tbody tr{
        height: 40px;
      }
    </style>
    <body style="display: flex; justify-content: center; flex-direction: column;">
    <img 
        style="align-self: center; padding: 0;" 
        src="data:image/jpeg;base64,${fs.readFileSync('./ctglogo.jpg').toString('base64')}" 
        width="50px" 
        height="50px" 
        alt="Club Logo" 
      />
      <h1 style="text-align: center; padding: 0;">CHITTAGONG CLUB LIMITED</h1>
      
      <h3 style="padding-left: 6rem;">${memberInfo.CusName}'s relative information</h3>
      <div style="padding-left: 6rem;">
        <table style="border: 2px solid black; width: 600px;">
          <thead>
            <tr>
              <td><b>Relation Type</b></td>
              <td>
                <table>
                  <tr><td style = "width: 70%; border-right:1px solid black;"w><b>Name</b></td> <td><b>Member ID</b></td></tr>
                </table>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Father</b></td>
              <td>
                <table>
                  <tr>
                    <td style = "width: 70%; border-right:1px solid black;"><b>${uppercaseWords(myObj.Father && myObj.Father[0].CusName!='0'? myObj.Father[0].CusName:'' || memberInfo?.FatherName || '')}</b></td>  
                    <td>${fatherId!=='0'&&fatherId!==undefined ? fatherId : '&nbsp;'}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td><b>Mother</b></td>
              <td>
                <table>
                  <tr>
                    <td style = "width: 70%; border-right:1px solid black;"><b>${uppercaseWords(myObj.Mother && myObj.Mother[0].CusName!='0'?myObj.Mother[0].CusName:'' || memberInfo?.MotherName || '')}</b></td>  
                    <td>${motherId!=='0' && motherId!==undefined ? motherId : '&nbsp;'}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td><b>Spouse</b></td>
              <td>
                <table>
                  <tr>
                    <td style = "width:70%; border-right:1px solid black;"><b>${uppercaseWords(memberInfo.SpouseName || '')}</b></td>  
                    <td><b>${uppercaseWords(memberInfo.PrvcusID_Spo1!='0'?memberInfo.PrvcusID_Spo1 : '&nbsp;')}</b></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td><b>Children</b></td>
              <td>
                <table>
                  <tr>
                    <td>
                        <table>
                          ${memberInfo.Child1 !== '0' ? `<tr><td style = "width: 70%; border-right:1px solid black;">${(memberInfo.Child1 || '&nbsp;')}</td><td>${(memberInfo.Child1Prvcusid!=='0'?memberInfo.Child1Prvcusid: '&nbsp;')}</td></tr>` : ''}
                          ${memberInfo.Child2 !== '0' ? `<tr><td style = "width: 70%; border-right:1px solid black;">${(memberInfo.Child2 || '&nbsp;')}</td><td>${(memberInfo.Child2Prvcusid!=='0'?memberInfo.Child2Prvcusid: '&nbsp;')}</td></tr>` : ''}
                          ${memberInfo.Child3 !== '0' ? `<tr><td style = "width: 70%; border-right:1px solid black;">${(memberInfo.Child3 || '&nbsp;')}</td><td>${(memberInfo.Child3Prvcusid!=='0'?memberInfo.Child3Prvcusid: '&nbsp;')}</td></tr>` : ''}
                          ${memberInfo.Child4 !== '0' ? `<tr><td style = "width: 70%; border-right:1px solid black;">${(memberInfo.Child4 || '&nbsp;')}</td><td>${(memberInfo.Child4Prvcusid!=='0'?memberInfo.Child4Prvcusid: '&nbsp;')}</td></tr>` : ''}
                          ${memberInfo.Child5 !== '0' ? `<tr><td style = "width: 70%; border-right:1px solid black;">${(memberInfo.Child5 || '&nbsp;')}</td><td>${(memberInfo.Child5Prvcusid!=='0'?memberInfo.Child5Prvcusid: '&nbsp;')}</td></tr>` : ''}
                          ${memberInfo.Child6 !== '0' ? `<tr><td style = "width: 70%; border-right:1px solid black;">${(memberInfo.Child6 || '&nbsp;')}</td><td>${(memberInfo.Child6Prvcusid!=='0'?memberInfo.Child6Prvcusid: '&nbsp;')}</td></tr>` : ''}
                          ${memberInfo.Child7 !== '0' ? `<tr><td style = "width: 70%; border-right:1px solid black;">${(memberInfo.Child7 || '&nbsp;')}</td><td>${(memberInfo.Child7Prvcusid!=='0'?memberInfo.Child7Prvcusid: '&nbsp;')}</td></tr>` : ''}
                          ${memberInfo.Child8 !== '0' ? `<tr><td style = "width: 70%; border-right:1px solid black;">${(memberInfo.Child8 || '&nbsp;')}</td><td>${(memberInfo.Child8Prvcusid!=='0'?memberInfo.Child8Prvcusid: '&nbsp;')}</td></tr>` : ''}
                          ${memberInfo.Child9 !== '0' ? `<tr><td style = "width: 70%; border-right:1px solid black;">${(memberInfo.Child9 || '&nbsp;')}</td><td>${(memberInfo.Child9Prvcusid!=='0'?memberInfo.Child9Prvcusid: '&nbsp;')}</td></tr>` : ''}
                          ${memberInfo.Child10 !== '0' ? `<tr><td style = "width: 70%; border-right:1px solid black;">${(memberInfo.Child10 || '&nbsp;')}</td><td>${(memberInfo.Child10Prvcusid!=='0'?memberInfo.Child10Prvcusid: '&nbsp;')}</td></tr>` : ''}
                        </table>
                    </td>
                  </tr>
                </table>
              </td>
            ${uncles.length > 0 ? `
              <tr>
                <td><b>Uncle/Aunt</b></td>
                <td>
                  <table>
                    <tr style = "padding: .5rem">
                      <td>
                        <table>
                          ${uncles.map(item => {
                              return `
                                <tr><td style = "width: 70%; border-right:1px solid black;">${item.split('@')[1]?item.split('@')[1]:''}</td><td>${item.split('@')[0]?item.split('@')[0]:''}</td></tr>
                              `
                            }).join(' ')}
                        </table>
                      </td>
                    </tr>
                  </table
                </td>
              </tr>
            ` : `
              <tr>
                <td><b>Uncle/Aunt</b></td>
                <td>
                  <table>
                    <tr style = "padding: .5rem">
                      <td>
                        <table>
                          <tr><td style = "width: 70%; border-right:1px solid black;">&nbsp;</td><td></td></tr>
                        </table>
                      </td>
                    </tr>
                  </table
                </td>
              </tr>
            `}

            <tr>
              <td><b>Brother/Sister</b></td>
              <td>
                <table>
                  ${brothers.length > 0 ? brothers.map(el => `<tr><td style = "width: 70%; border-right:1px solid black;">${el.split('@')[0]}</td><td>${el.split('@')[1] || '&nbsp;'}</td></tr>`).join(' ') : `<td style = "width: 70%; border-right: 1px solid black;">&nbsp;</td><td></td>`}
                </table>
              </td>
            </tr>
            <tr>
              <td><b>Grandfather</b></td>
              <td>
                <table>
                  <tr>
                    <td style = "width:70%; border-right:1px solid black;">${ grandfatherInfo?.CusName || '&nbsp;' }</td>
                    <td>${ grandfatherInfo?.PrvCusID || '&nbsp;'}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td><b>Grandmother</b></td>
              <td>
                <table>
                  <tr>
                    <td style = "width: 70%; border-right:1px solid black;">${ grandfatherInfo?.SpouseName || '&nbsp;'}</td>
                    <td>${ grandfatherInfo?.PrvcusID_Spo1 || '&nbsp;'}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td><b>Grandchildren</b></td>
              <td>
                <table>
                  ${grandChildrenInfos.length > 0 ? grandChildrenInfos.map(el => `<tr><td style = "width: 70%; border-right:1px solid black;">${el.split('@')[1]}</td><td>${el.split('@')[0] || 'Not a member &nbsp;'}</td></tr>`).join(' ') : `<td style = "width: 70%; border-right: 1px solid black;">&nbsp;</td><td></td>`}
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </body>
  </html>
`;

// Load the content into Puppeteer
await page.setContent(htmlContent);

        const pdfPath = path.join(__dirname,'../', 'public', 'generated.pdf');
        // Generate the PDF buffer
        const pdfBuffer = await page.pdf({
          path: pdfPath,  
          format: 'A4', // Page format (optional)
          printBackground: true, // Include background graphics
        });
    
        // Close the Puppeteer browser instance
        await browser.close();
    
        // Set the response headers to serve the PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');

        res.download(pdfPath)
        // res.end(pdfBuffer);
      } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
      }
};
