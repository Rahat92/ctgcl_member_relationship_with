const fs = require("fs");
const puppeteer = require("puppeteer");
const pool = require("../utils/connectToDb");
const path = require('path')
exports.generateReport = async (req, res) => {
    const PrvCusID=req.params.id;
    let memberInfo = await(await pool.request().query(`select * from CustomerMst where PrvCusID='${PrvCusID}'`)).recordset[0]
    const memberInfoDetail = await(await pool.request().query(`select * from CustomerMst_MoreChildren where PrvCusID='${PrvCusID}'`)).recordset[0]
    console.log('detail ', memberInfoDetail)
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
    const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
    console.log(memberInfo)
    try {
        // Launch a Puppeteer browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        // Define the content or URL to convert to PDF
        const htmlContent = `
          <html>
            <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border: 1px solid black;
                    padding: .5rem;
                    padding-left: 1rem;
                    font-weight: 600;
                    font-size: 18px;
                }
                table table td{
                    border: none;
                    padding: 0;
                }
            </style>
            <body style = "display:flex; justify-content: center; flex-direction:column;">
              <h1 style = "text-align:center; padding: 0">CHITTAGONG CLUB LIMITED</h1>
              <img style = "align-self:center; padding: 0" src="data:image/jpeg;base64,${fs
                .readFileSync('./ctglogo.jpg')
                .toString(
                    "base64"
                )}" width='50px' height='50px' alt="alt text" />

              <h3 style = "padding-left: 6rem">${memberInfo.CusName}'s relative information</h3>
              <div style = "padding-left: 6rem">
                <table style = 'border: 2px solid black; width: 600px; '>
                <thead>
                    <tr><td><b>Relation Type</b></td><td><b>Name</b></td><td>Member ID</td></tr>
                </thead>
                <tbody>
                    <tr><td><b>Father</b></td><td><b>${ uppercaseWords(myObj.Father&&myObj.Father[0].CusName || memberInfo?.FatherName || '')}</b></td></tr>
                    <tr><td><b>Mother</b></td><td><b>${uppercaseWords(myObj.Mother&&myObj.Mother[0].CusName || memberInfo?.MotherName || '')}</b></td></tr>
                    <tr>
                        <td><b>Spouse</b></td><td>
                            <table style = 'border-collapse:collapse'>
                                <tr><td><b>${ uppercaseWords(myObj.Spouse&&myObj.Spouse[0].CusName || memberInfo?.SpouseName || '')}</b></td></tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Children</b></td><td>
                            <table>
                                ${memberInfo.Child1!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child1 || '')}</td></tr>`:''}
                                ${memberInfo.Child2!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child2 || '')}</td></tr>`:''}
                                ${memberInfo.Child3!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child3 || '')}</td></tr>`:''}
                                ${memberInfo.Child4!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child4 || '')}</td></tr>`:''}
                                ${memberInfo.Child5!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child5 || '')}</td></tr>`:''}
                                ${memberInfo.Child6!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child6 || '')}</td></tr>`:''}
                                ${memberInfo.Child7!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child7 || '')}</td></tr>`:''}
                                ${memberInfo.Child8!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child8 || '')}</td></tr>`:''}
                                ${memberInfo.Child9!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child9 || '')}</td></tr>`:''}
                                ${memberInfo.Child10!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child10 || '')}</td></tr>`:''}
                            </table>
                        </td>
                        <td>
                            <table>
                                ${memberInfo.Child1Prvcusid!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child1Prvcusid || '')}</td></tr>`:''}
                                ${memberInfo.Child2Prvcusid!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child2Prvcusid || '')}</td></tr>`:''}
                                ${memberInfo.Child3Prvcusid!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child3Prvcusid || '')}</td></tr>`:''}
                                ${memberInfo.Child4Prvcusid!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child4Prvcusid || '')}</td></tr>`:''}
                                ${memberInfo.Child5Prvcusid!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child5Prvcusid || '')}</td></tr>`:''}
                                ${memberInfo.Child6Prvcusid!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child6Prvcusid || '')}</td></tr>`:''}
                                ${memberInfo.Child7Prvcusid!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child7Prvcusid || '')}</td></tr>`:''}
                                ${memberInfo.Child8Prvcusid!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child8Prvcusid || '')}</td></tr>`:''}
                                ${memberInfo.Child9Prvcusid!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child9Prvcusid || '')}</td></tr>`:''}
                                ${memberInfo.Child10Prvcusid!=='0'?`<tr><td>${uppercaseWords(memberInfo.Child10Prvcusid || '')}</td></tr>`:''}
                            </table>
                        </td>
                    </tr>
                    ${myObj['Uncle/Aunt']?.length>0?`<tr>
                        <td><b>Uncle/Aunt</b></td><td>
                            <table>
                                <tr><td>1: </td><td>${uppercaseWords(myObj['Uncle/Aunt']&&myObj['Uncle/Aunt'][0]?.CusName || '') || ''}</td></tr>
                                <tr><td>2: </td><td>${uppercaseWords(myObj['Uncle/Aunt']&&myObj['Uncle/Aunt'][1]?.CusName || '') || ''}</td></tr>
                            </table>
                        </td>
                    </tr>`:''}
                    <tr>
                        <td><b>Brother/Sister</b></td>
                        <td>
                            <table>
                                ${brothers.length>0?brothers.map(el => {
                                    return `<tr><td>${el}</td></tr>`
                                }).join(''):''}
                            </table>
                        </td>
                    </tr>
                    <tr><td>Grandfather</td>${grandfather?.FatherName}<td></td></tr>
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
