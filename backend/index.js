const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const SibApiV3Sdk = require('sib-api-v3-sdk');


dotenv.config();

const app = express();
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;


if (!process.env.BREVO_API_KEY) {
  console.error('BREVO_API_KEY is not set in the environment variables.');
  process.exit(1); 
}

const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();

app.use(cors({
  origin: 'https://perfect-brew-e-book.web.app',
  optionsSuccessStatus: 200,
}));
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/send-email', async (req, res) => {

  const { email, name } = req.body;

  try {


    const response = await brevoClient.sendTransacEmail({
      sender: { email: "brewperfect3@gmail.com", name: "Perfect Brew" },
      to: [{ email, name }],
      subject: "Get your free ebook!",
      htmlContent: `<html><body>
      <h1>Welcome to Perfect Brew ${name}!</h1>
      <p>Thank you for joining us on this journey to perfect coffee making! This guide is just a glimpse of what's to come from our upcoming online store, where you'll find everything you need to brew your ideal cup—expertly curated equipment, and all the inspiration you need. Stay tuned for our launch and let's make every coffee moment extraordinary together!</p>
      <a href="https://drive.google.com/uc?id=1Hn1ZpI4Op4zinVE8EDOQnV6FkGTSxy8h&export=download">Download Coffee Guide</a>
      </body></html>`,
     
    });

    console.log('Email sent successfully:', response);
    res.status(200).json({ message: "Email sent successfully", response });
  } catch (error) {
  
    console.error('Error sending email:', error);
    res.status(500).json({ message: "Error occurred while sending email", error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
