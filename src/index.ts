import express from 'express';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const app = express();
const port = 3200; // Port 3200

app.use(express.json());

app.get('/open-positions', async (req, res) => {
  const department = req.query.department as string;

  if (!department) {
    res.status(400).json({ message: 'Department is required!' });
    return;
  }

  try {
    const response = await fetch('https://www.actian.com/company/careers');
    const html = await response.text();

    const root = parse(html);
    const jobTitles: string[] = [];

    root.querySelectorAll('.job-heading').forEach((element) => {
      const dept = element.querySelector('.department')?.textContent?.trim();
      if (dept === department) {
        const jobNameElements = element.nextElementSibling?.querySelectorAll('.job-name');
        if (jobNameElements) {
          jobNameElements.forEach((jobNameElement) => {
            const jobName = jobNameElement.textContent?.trim();
            if (jobName) {
              jobTitles.push(jobName);
            }
          });
        }
      }
    });

    if (jobTitles.length === 0) {
      res.status(404).json({ message: 'No Department Found!.' });
    } else {
      res.json({ department, jobTitles });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

