const axios = require("axios");

async function fetchTrials(disease) {
  try {
    const url = `https://clinicaltrials.gov/api/v2/studies?query.cond=${disease}&pageSize=15&format=json`;

    const res = await axios.get(url);
    const rawStudies = res.data.studies || [];

    return rawStudies
      .map(study => ({
        title: study.protocolSection.identificationModule.briefTitle,
        status: study.protocolSection.statusModule.overallStatus,
        location: study.protocolSection.contactsLocationsModule?.locations?.[0]?.city || "Global"
      }))
      // Filter out trials that aren't useful to a patient
      .filter(t => 
        t.status !== 'WITHDRAWN' && 
        t.status !== 'TERMINATED' && 
        t.status !== 'UNKNOWN'
      )
      .slice(0, 6);

  } catch (err) {
    console.error("Trials Error:", err.message);
    return [];
  }
}

module.exports = { fetchTrials };