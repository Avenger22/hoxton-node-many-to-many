import Database from 'better-sqlite3'

const db = new Database('./data.db', {
  verbose: console.log
})

const applicants = [
  { 
    name: 'Jurgen1', 
    email: "jurgen1@email.com" 
  },
  { 
    name: 'Jurgen2',
    email: "jurgen2@email.com" 
  },
  { 
    name: 'Jurgen3',
    email: "jurgen3@email.com" 
  },
  { 
    name: 'Jurgen4',
    email: "jurgen4@email.com" 
  }
]

const interviewers = [
  { 
    name: 'Random1',
    email: "random1@email.com"  
  },
  { 
    name: 'Random2',
    email: "random2@email.com" 
  },
  { 
    name: 'Random3',
    email: "random3@email.com" 
  },
  { 
    name: 'Random4',
    email: "random4@email.com" 
  },
  { 
    name: 'Random5',
    email: "random5@email.com"  
  }
]

const interviews = [
  {
    applicantId: 4,
    interviewerId: 5,
    date: "22/12/2010",
    score: 7
  },
  {
    applicantId: 4,
    interviewerId: 2,
    date: "22/1/2010",
    score: 2
  },
  {
    applicantId: 4,
    interviewerId: 1,
    date: "22/1/2010",
    score: 1
  },
  {
    applicantId: 3,
    interviewerId: 1,
    date: "31/12/2010",
    score: 10
  },
  {
    applicantId: 2,
    interviewerId: 5,
    date: "22/12/2010",
    score: 10
  },
  {
    applicantId: 2,
    interviewerId: 4,
    date: "11/12/2010",
    score: 7
  },
  {
    applicantId: 2,
    interviewerId: 1,
    date: "5/11/2010",
    score: 6
  },
  {
    applicantId: 1,
    interviewerId: 1,
    date: "22/12/2010",
    score: 7
  },
  {
    applicantId: 1,
    interviewerId: 5,
    date: "24/12/2010",
    score: 10
  },
  {
    applicantId: 1,
    interviewerId: 3,
    date: "10/12/2010",
    score: 4
  }
]

db.exec(`
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS applicants;
DROP TABLE IF EXISTS interviewers;

CREATE TABLE IF NOT EXISTS applicants (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS interviewers (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER,
  applicantId INTEGER,
  interviewerId INTEGER,
  date TEXT NOT NULL,
  score INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (applicantId) REFERENCES applicants(id),
  FOREIGN KEY (interviewerId) REFERENCES interviewers(id)
);
`)

export const createApplicant = db.prepare(`
INSERT INTO applicants (name, email) VALUES (?, ?);
`)

export const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (?, ?);
`)

export const createInterview = db.prepare(`
INSERT INTO interviews (applicantId, interviewerId, date, score)
VALUES (?, ? ,?, ?);
`)

for (const applicant of applicants) {
  createApplicant.run(applicant.name, applicant.email)
}

for (const interviewer of interviewers) {
  createInterviewer.run(interviewer.name, interviewer.email)
}

for (const interview of interviews) {
  createInterview.run(interview.applicantId, interview.interviewerId, interview.date, interview.score)
}