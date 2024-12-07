import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';
import { read, utils } from 'xlsx';
// CORS headers handling
const corsHeaders = {
  // 'Access-Control-Allow-Origin': 'https://internal-od.vercel.app/teamlead',
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS preflight request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export const dynamic = 'force-dynamic';

export async function POST(req) {
  console.log('Email sending route hit');
  const response = {
    headers: corsHeaders
  };

  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email credentials');
      return NextResponse.json({ 
        error: 'Email credentials not configured' 
      }, { 
        status: 500,
        ...response
      });
    }

    // Check if the request is a multipart/form-data request
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json({ 
        error: 'Invalid request format. Must be multipart/form-data' 
      }, { 
        status: 400,
        ...response
      });
    }


    // Parse form data
    const formData = await req.formData();
    const excelFile = formData.get('file');
    const subject = formData.get('subject')?.toString() || 'Automated Email';

    if (!excelFile || !(excelFile instanceof File)) {
      console.error('No Excel file uploaded');
      return NextResponse.json({ 
        error: 'Excel file is required' 
      }, { 
        status: 400,
        ...response
      });
    }

    // Read constant template
    const templatePath = path.join(process.cwd(), 'src', 'app', 'template', 'template1.html');
    const htmlContent = await fs.readFile(templatePath, 'utf-8');

    // Read Excel file
    const arrayBuffer = await excelFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Read Excel data
    const workbook = read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      console.error('No data found in Excel file');
      return NextResponse.json({ 
        error: 'No data found in Excel file' 
      }, { status: 400 });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Process emails
    const emailResults = [];

    for (const row of data) {
      if (!row.Email) {
        emailResults.push({
          email: 'Unknown',
          status: 'Failed',
          error: 'Missing email address'
        });
        continue;
      }

      // Replace placeholders in HTML template
      let personalizedHtml = htmlContent;
      Object.keys(row).forEach(key => {
        personalizedHtml = personalizedHtml.replace(new RegExp(`{{${key}}}`, 'g'), row[key] || '');
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: row.Email,
          subject: subject,
          html: personalizedHtml
        });

        emailResults.push({
          email: row.Email,
          status: 'Success'
        });
      } catch (emailError) {
        console.error(`Email send error for ${row.Email}:`, emailError);
        emailResults.push({
          email: row.Email,
          status: 'Failed',
          error: (emailError).message
        });
      }
    }

    return NextResponse.json({ 
      message: 'Emails processed', 
      results: emailResults 
    }, response);

  } catch (error) {
    console.error('Comprehensive error:', error);
    return NextResponse.json({ 
      error: 'Failed to send emails', 
      details: (error).message 
    }, { 
      status: 500,
      ...response
    });
  }
}