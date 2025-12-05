export const verifyEmailTemplate = (name: string, link: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; 
              background: #ffffff; border: 1px solid #e5e5e5; border-radius: 10px; 
              padding: 32px;">

    <h2 style="text-align: center; color: #333; margin-bottom: 20px;">
      Welcome to <span style="color: #4B7BF5;">ReadStack</span> 📚
    </h2>

    <p style="font-size: 15px; color: #444;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      Thank you for creating an account with <strong>ReadStack</strong>.  
      Please verify your email address by clicking the button below:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <a href="${link}" 
            style="
              background-color: #4B7BF5;
              color: #ffffff;
              padding: 14px 26px;
              text-decoration: none;
              border-radius: 6px;
              font-size: 16px;
              font-weight: bold;
              display: inline-block;
            ">
            Verify Email
          </a>
        </td>
      </tr>
    </table>

    <p style="font-size: 13px; color: #777;">
      This link will expire in <strong>24 hours</strong>.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

    <p style="font-size: 12px; color: #999; text-align: center;">
      If you did not request this email, you can safely ignore it.
    </p>
  </div>
`;
