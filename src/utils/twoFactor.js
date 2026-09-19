const BASE_URL = 'https://2factor.in/API/V1';

const requireApiKey = () => {
  const apiKey = process.env.TWOFACTOR_API_KEY;
  if (!apiKey) throw new Error('TWOFACTOR_API_KEY is not set in the environment');
  return apiKey;
};

export const sendOtp = async (phone) => {
  const apiKey = requireApiKey();
  const res = await fetch(`${BASE_URL}/${apiKey}/SMS/${phone}/AUTOGEN`);
  const data = await res.json();

  if (data.Status !== 'Success') {
    throw new Error(data.Details || 'Failed to send OTP');
  }

  return data.Details; // 2Factor session id
};

export const verifyOtp = async (sessionId, otp) => {
  const apiKey = requireApiKey();
  const res = await fetch(`${BASE_URL}/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`);
  const data = await res.json();
  return data.Status === 'Success';
};
