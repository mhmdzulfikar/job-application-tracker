export const isTodayInterview = (job) => {
  if (!job.interviewDate) return false;
  if (job.status === "Rejected" || job.status === "Offer") return false;

  const targetDate = new Date(job.interviewDate);
  const today = new Date();

  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return targetDate.getTime() === today.getTime();
};