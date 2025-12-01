export const verifyEmailTemplate = (name: string, link: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafafa;">
    <h2 style="color: #222; text-align: center;">
      Welcome to <span style="color: #4B7BF5;">ArticleFlow</span> 📝
    </h2>

    <p style="font-size: 16px; color: #555;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size: 16px; color: #555;">
      Thanks for signing up! Please verify your email by clicking the button below:
    </p>

    <a href="${link}" target="_blank" 
       style="display: block; width: fit-content; margin: 20px auto; padding: 12px 20px;
              background-color: #4B7BF5; color: #fff; text-decoration: none; 
              border-radius: 6px; font-weight: bold; text-align: center;">
      Verify Email
    </a>

    <p style="font-size: 14px; color: #777;">
      This link will expire in 24 hours.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">

    <p style="font-size: 12px; color: #aaa; text-align: center;">
      If you did not create an ArticleFlow account, you can safely ignore this email.
    </p>
  </div>
`;
