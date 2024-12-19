
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';
import { read, utils } from 'xlsx';

// CORS headers handling
const corsHeaders = {
   'Access-Control-Allow-Origin': 'https://internal-od.vercel.app',
  //'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS preflight request
export async function OPTIONS() {
  console.log('OPTIONS request received');
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export const dynamic = 'force-dynamic';

// Function to format date in en-GB format
function formatDateGB(dateInput) {
  console.log('Formatting date:', dateInput);
  if (!dateInput) return '';

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    
    const formatted = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    console.log('Formatted date:', formatted);
    return formatted;
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
}

export async function POST(req) {
  console.log('=====================================');
  console.log('POST request received at:', new Date().toISOString());
  console.log('=====================================');

  const response = { headers: corsHeaders };

  try {
    // Log environment variables status (without exposing actual values)
    console.log('Environment variables check:');
    console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email credentials');
      return NextResponse.json({
        error: 'Email credentials not configured'
      }, {
        status: 500,
        ...response
      });
    }

    // Check content type
    const contentType = req.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (!contentType?.includes('multipart/form-data')) {
      console.error('Invalid content type:', contentType);
      return NextResponse.json({
        error: 'Invalid request format. Must be multipart/form-data'
      }, {
        status: 400,
        ...response
      });
    }

    // Parse form data
    console.log('Parsing form data...');
    const formData = await req.formData();
    const excelFile = formData.get('file');
    const subject = formData.get('subject')?.toString() || 'Automated Email';
    const hallValue = formData.get('hall')?.toString() || '';
    const noteValue = formData.get('note')?.toString() || '';

    console.log('Form data parsed:');
    console.log('Subject:', subject);
    console.log('Hall:', hallValue);
    console.log('Note:', noteValue);
    console.log('Excel file received:', !!excelFile);
    console.log('Excel file name:', excelFile?.name);
    console.log('Excel file size:', excelFile?.size, 'bytes');

    if (!excelFile || !(excelFile instanceof File)) {
      console.error('Excel file validation failed');
      return NextResponse.json({
        error: 'Excel file is required'
      }, {
        status: 400,
        ...response
      });
    }

    // Read template
    console.log('Reading template file...');
    const templatePath = path.join(process.cwd(), 'src', 'app', 'template', 'template1.html');
    console.log('Template path:', templatePath);
    
    let htmlContent = await fs.readFile(templatePath, 'utf-8');
    console.log('Template loaded, length:', htmlContent.length);

    htmlContent = htmlContent.replace('{{Hall}}', hallValue);
    htmlContent = htmlContent.replace('{{Note}}', noteValue);

    // Process Excel file
    console.log('Processing Excel file...');
    const arrayBuffer = await excelFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('Reading Excel workbook...');
    const workbook = read(buffer);
    const sheetName = workbook.SheetNames[0];
    console.log('Sheet name:', sheetName);
    
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet);
    console.log('Excel data rows:', data.length);

    if (!data || data.length === 0) {
      console.error('No data found in Excel file');
      return NextResponse.json({
        error: 'No data found in Excel file'
      }, { 
        status: 400,
        ...response 
      });
    }

    // Setup email transporter
    console.log('Setting up email transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Process emails
    console.log('Starting email processing...');
    const emailResults = [];
    let successCount = 0;

    for (const row of data) {
      console.log('Processing row for email:', row.Email);

      if (!row.Email) {
        console.log('Missing email address in row');
        emailResults.push({
          email: 'Unknown',
          status: 'Failed',
          error: 'Missing email address'
        });
        continue;
      }

      // Prepare email content
      let personalizedHtml = htmlContent;
      Object.keys(row).forEach(key => {
        const value = key.toLowerCase().includes('date') 
          ? formatDateGB(row[key]) 
          : row[key] || '';
        
        personalizedHtml = personalizedHtml.replace(
          new RegExp(`{{${key}}}`, 'g'), 
          value
        );
      });

      try {
        console.log('Sending email to:', row.Email);
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: row.Email,
          subject: subject,
          html: personalizedHtml
        });

        console.log('Email sent successfully to:', row.Email);
        successCount++;
        emailResults.push({
          email: row.Email,
          status: 'Success'
        });
      } catch (emailError) {
        console.error(`Email send error for ${row.Email}:`, emailError);
        emailResults.push({
          email: row.Email,
          status: 'Failed',
          error: emailError.message
        });
      }
    }

    console.log('Email processing completed');
    console.log('Success count:', successCount);
    console.log('Total emails:', data.length);
    console.log('Failed count:', data.length - successCount);

    return NextResponse.json({
      message: 'Emails processed',
      results: emailResults,
      successfulEmails: successCount,
      totalEmails: data.length,
      failedEmails: data.length - successCount
    }, response);

  } catch (error) {
    console.error('Comprehensive error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({
      error: 'Failed to send emails',
      details: error.message
    }, {
      status: 500,
      ...response
    });
  }
}