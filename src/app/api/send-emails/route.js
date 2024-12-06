// // import { NextRequest, NextResponse } from 'next/server';
// // import fs from 'fs/promises';
// // import path from 'path';
// // import nodemailer from 'nodemailer';
// // import { read, utils } from 'xlsx';

// // export const dynamic = 'force-dynamic';

// // export async function POST(req) {
// //   console.log('Email sending route hit');

// //   try {
// //     // Validate environment variables
// //     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
// //       console.error('Missing email credentials');
// //       return NextResponse.json({ 
// //         error: 'Email credentials not configured' 
// //       }, { status: 500 });
// //     }

// //     // Parse form data
// //     const formData = await req.formData();
// //     const excelFile = formData.get('excelFile') ;
// //     const htmlFile = formData.get('htmlFile') ;
// //     const subject = formData.get('subject')  || 'Automated Email';

// //     if (!excelFile || !htmlFile) {
// //       console.error('No file uploaded');
// //       return NextResponse.json({ 
// //         error: 'Both Excel and HTML files are required' 
// //       }, { status: 400 });
// //     }

// //     // Read HTML file
// //     const htmlBuffer = await htmlFile.arrayBuffer();
// //     const htmlContent = Buffer.from(htmlBuffer).toString('utf-8');

// //     // Read Excel file
// //     const arrayBuffer = await excelFile.arrayBuffer();
// //     const buffer = Buffer.from(arrayBuffer);

// //     // Read Excel data
// //     const workbook = read(buffer);
// //     const sheetName = workbook.SheetNames[0];
// //     const worksheet = workbook.Sheets[sheetName];
// //     const data = utils.sheet_to_json(worksheet);

// //     if (!data || data.length === 0) {
// //       console.error('No data found in Excel file');
// //       return NextResponse.json({ 
// //         error: 'No data found in Excel file' 
// //       }, { status: 400 });
// //     }

// //     // Create email transporter
// //     const transporter = nodemailer.createTransport({
// //       service: 'gmail',
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS
// //       }
// //     });

// //     // Process emails
// //     const emailResults = [];

// //     for (const row of data) {
// //       if (!row.Email) {
// //         emailResults.push({
// //           email: 'Unknown',
// //           status: 'Failed',
// //           error: 'Missing email address'
// //         });
// //         continue;
// //       }

// //       // Replace placeholders in HTML template
// //       let personalizedHtml = htmlContent;
// //       Object.keys(row).forEach(key => {
// //         personalizedHtml = personalizedHtml.replace(new RegExp(`{{${key}}}`, 'g'), row[key] || '');
// //       });

// //       try {
// //         await transporter.sendMail({
// //           from: process.env.EMAIL_USER,
// //           to: row.Email,
// //           subject: subject,
// //           html: personalizedHtml
// //         });

// //         emailResults.push({
// //           email: row.Email,
// //           status: 'Success'
// //         });
// //       } catch (emailError) {
// //         console.error(`Email send error for ${row.Email}:`, emailError);
// //         emailResults.push({
// //           email: row.Email,
// //           status: 'Failed',
// //           error: (emailError).message
// //         });
// //       }
// //     }

// //     return NextResponse.json({ 
// //       message: 'Emails processed', 
// //       results: emailResults 
// //     });

// //   } catch (error) {
// //     console.error('Comprehensive error:', error);
// //     return NextResponse.json({ 
// //       error: 'Failed to send emails', 
// //       details: (error ).message 
// //     }, { status: 500 });
// //   }
// // }
// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';
// import nodemailer from 'nodemailer';
// import { read, utils } from 'xlsx';

// export const dynamic = 'force-dynamic';

// export async function POST(req) {
//   console.log('Email sending route hit');

//   try {
//     // Validate environment variables
//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//       console.error('Missing email credentials');
//       return NextResponse.json({ 
//         error: 'Email credentials not configured' 
//       }, { status: 500 });
//     }

//     // Parse form data
//     const formData = await req.formData();
//     const excelFile = formData.get('excelFile');
//     const subject = formData.get('subject') || 'Automated Email';

//     if (!excelFile) {
//       console.error('No Excel file uploaded');
//       return NextResponse.json({ 
//         error: 'Excel file is required' 
//       }, { status: 400 });
//     }

//     // Read constant template
//     const templatePath = path.join(process.cwd(), 'src', 'app', 'template', 'template1.html');
//     const htmlContent = await fs.readFile(templatePath, 'utf-8');

//     // Read Excel file
//     const arrayBuffer = await excelFile.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Read Excel data
//     const workbook = read(buffer);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = utils.sheet_to_json(worksheet);

//     if (!data || data.length === 0) {
//       console.error('No data found in Excel file');
//       return NextResponse.json({ 
//         error: 'No data found in Excel file' 
//       }, { status: 400 });
//     }

//     // Create email transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     // Process emails
//     const emailResults = [];

//     for (const row of data) {
//       if (!row.Email) {
//         emailResults.push({
//           email: 'Unknown',
//           status: 'Failed',
//           error: 'Missing email address'
//         });
//         continue;
//       }

//       // Replace placeholders in HTML template
//       let personalizedHtml = htmlContent;
//       Object.keys(row).forEach(key => {
//         personalizedHtml = personalizedHtml.replace(new RegExp(`{{${key}}}`, 'g'), row[key] || '');
//       });

//       try {
//         await transporter.sendMail({
//           from: process.env.EMAIL_USER,
//           to: row.Email,
//           subject: subject,
//           html: personalizedHtml
//         });

//         emailResults.push({
//           email: row.Email,
//           status: 'Success'
//         });
//       } catch (emailError) {
//         console.error(`Email send error for ${row.Email}:`, emailError);
//         emailResults.push({
//           email: row.Email,
//           status: 'Failed',
//           error: (emailError).message
//         });
//       }
//     }

//     return NextResponse.json({ 
//       message: 'Emails processed', 
//       results: emailResults 
//     });

//   } catch (error) {
//     console.error('Comprehensive error:', error);
//     return NextResponse.json({ 
//       error: 'Failed to send emails', 
//       details: (error).message 
//     }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { read, utils, write } from 'xlsx';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  console.log('Email sending route hit');

  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ 
        error: 'Email credentials not configured' 
      }, { status: 500 });
    }

    // Parse form data
    const formData = await req.formData();
    const excelFile = formData.get('excelFile');
    const subject = formData.get('subject') || 'Approved Requests';

    if (!excelFile) {
      return NextResponse.json({ 
        error: 'Excel file is required' 
      }, { status: 400 });
    }

    // Read Excel file
    const arrayBuffer = await excelFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet);

    // Prepare transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Process emails
    const emailResults = [];
    const modifiedData = data.map(row => ({
      Name: row.user?.name || 'N/A',
      Email: row.user?.email || 'N/A',
      CustomField: `${row.reason} - ${row.description}`
    }));

    // Create modified Excel for sending
    const newWorksheet = utils.json_to_sheet(modifiedData);
    const newWorkbook = utils.book_new();
    utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');

    for (const row of modifiedData) {
      if (!row.Email || row.Email === 'N/A') {
        emailResults.push({
          email: 'Unknown',
          status: 'Failed',
          error: 'Missing email address'
        });
        continue;
      }

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: row.Email,
          subject: subject,
          html: `
            <h1>Approved Request Details</h1>
            <p><strong>Name:</strong> ${row.Name}</p>
            <p><strong>Custom Details:</strong> ${row.CustomField}</p>
          `,
          attachments: [{
            filename: 'approved_requests.xlsx',
            content: write(newWorkbook, { type: 'buffer', bookType: 'xlsx' })
          }]
        });

        emailResults.push({
          email: row.Email,
          status: 'Success'
        });
      } catch (emailError) {
        emailResults.push({
          email: row.Email,
          status: 'Failed',
          error: (emailError ).message
        });
      }
    }

    return NextResponse.json({ 
      message: 'Emails processed', 
      results: emailResults 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to send emails', 
      details: (error).message 
    }, { status: 500 });
  }
}