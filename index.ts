import express from "express";
import Database from "better-sqlite3";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("./data.db", {
  verbose: console.log,
});

// #region "Sql queries"
const getAllApplicants = db.prepare(`
SELECT applicants.* FROM applicants;
`);

const getApplicantById = db.prepare(`
SELECT * FROM applicants WHERE id = ?
`);

const getAllInterviewers = db.prepare(`
SELECT interviewers.* FROM interviewers;
`);

const getInterviewerById = db.prepare(`
SELECT * FROM interviewers WHERE id = ?
`);

const getAllinterviews = db.prepare(`
SELECT * FROM interviews;
`);

const getInterviewById = db.prepare(`
SELECT * FROM interviews WHERE id = ?
`);

const getApplicantByinterviewerId = db.prepare(`SELECT DISTINCT applicants.*, interviews.date, interviews.score FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
WHERE interviews.interviewerId = ?;`)

const getInterviewerByApplicantId = db.prepare(`SELECT DISTINCT interviewers.*, interviews.date, interviews.score FROM interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
WHERE interviews.applicantId = ?;`)
// #endregion

// #region 'End points API'
app.get("/applicants", (req, res) => {

  const applicants = getAllApplicants.all();

  for (const applicant of applicants) {

    const interviewer = getInterviewerByApplicantId.all(applicant.id)
    applicant.interviewer = interviewer;

  }

  res.send(applicants);

});

app.get("/applicants/:id", (req, res) => {

  const id = req.params.id;
  const applicant = getApplicantById.get(id);
  
  const interviewer = getInterviewerByApplicantId.all(applicant.id)
  applicant.interviewer = interviewer;

  res.send(applicant);

});


app.get("/interviewers", (req, res) => {

  const interviewers = getAllInterviewers.all();

  for (const interviewer of interviewers) {

    const applicants = getApplicantByinterviewerId.all(interviewer.id)
    interviewer.applicants = applicants;

  }

  res.send(interviewers);

});

app.get("/interviewers/:id", (req, res) => {

  const id = req.params.id;
  const interviewer = getInterviewerById.get(id);

  const applicants = getApplicantByinterviewerId.all(interviewer.id)
  interviewer.applicants = applicants;

  res.send(interviewer);

});


app.get("/interviews", (req, res) => {

  const interviews = getAllinterviews.all();
  res.send(interviews);

});

app.get("/interviews/:id", (req, res) => {

  const id = req.params.id;

  const interview = getInterviewById.get(id);
  res.send(interview);

});
// #endregion

app.listen(4000, () => console.log(`Listening on: http://localhost:4000`));