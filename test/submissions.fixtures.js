function makeSubmissionsArray() {
    return [
        {
            id: 1,
            fullname: "Avery Pollack",
            phonenumber: "1234567890",
            email: "avery@email.com",
            interestedposition: "Art instructor",
            resumelink: "http://avery.com"
        },
        {
            id: 2,
            fullname: "Avery Poll",
            phonenumber: "1234567890",
            email: "avery@email.com",
            interestedposition: "Robotics instructor",
            resumelink: "http://avery.com"
        }
    ]
  }
  function makeMaliciousSubmission() {
    const maliciousSubmission = {
      id: 911,
      fullname: 'Naughty naughty very naughty <script>alert("xss");</script>',
      phonenumber: '1234567890',
      email: '`Bad image@ <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`',
      interestedposition: `Robotics instructor`,
      resumelink: "http://avery.com"
    }
    const expectedSubmission = {
      ...maliciousSubmission,
      fullname: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      email: `Bad image @<img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
      maliciousSubmission,
      expectedSubmission,
    }
  }
  
  module.exports = {
    makeSubmissionsArray,
    makeMaliciousSubmission
  }