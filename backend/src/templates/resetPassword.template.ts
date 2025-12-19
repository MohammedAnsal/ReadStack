export const resetPasswordTemplate = (name: string, link: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;
              background: #ffffff; border: 1px solid #e5e5e5; border-radius: 10px;
              padding: 32px;">

    <h2 style="text-align: center; color: #333; margin-bottom: 20px;">
      Reset your <span style="color: #4B7BF5;">ReadStack</span> password 🔐
    </h2>

    <p style="font-size: 15px; color: #444;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size: 15px; color: #555; line-height: 1.6;">
      We received a request to reset the password for your <strong>ReadStack</strong> account.
      If you made this request, please click the button below to choose a new password:
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
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    <p style="font-size: 13px; color: #777;">
      This link will expire in <strong>24 hours</strong>.
      If you did not request a password reset, you can safely ignore this email
      and your password will remain unchanged.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

    <p style="font-size: 12px; color: #999; text-align: center;">
      For your security, never share this email or your password with anyone.
    </p>
  </div>
`;


