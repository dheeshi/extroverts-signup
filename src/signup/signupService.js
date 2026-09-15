const OTP_LENGTH = 6;

let currentOtp = null;
let currentEmail = null;

function delay(ms = 700) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOtp(email) {
  await delay();

  currentEmail = email.trim().toLowerCase();
  currentOtp = generateOtp();

  console.info(
    `%c[Demo OTP] ${currentEmail}: ${currentOtp}`,
    "color:#00ff88;font-weight:bold;font-size:14px"
  );

  return {
    success: true,
    email: currentEmail,
    expiresIn: 60,
  };
}

export async function verifyOtp(email, otp) {
  await delay();

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedOtp = String(otp).replace(/\D/g, "");

  if (normalizedEmail !== currentEmail) {
    return {
      success: false,
      message:
        "This verification session has expired. Please request a new OTP.",
    };
  }

  if (normalizedOtp.length !== OTP_LENGTH) {
    return {
      success: false,
      message: "Please enter the complete 6-digit OTP.",
    };
  }

  if (normalizedOtp !== currentOtp) {
    return {
      success: false,
      message: "The OTP you entered is incorrect. Please try again.",
    };
  }

  return {
    success: true,
    email: normalizedEmail,
  };
}

export async function completeSignup(profile) {
  await delay(1100);

  return {
    success: true,
    profile,
  };
}