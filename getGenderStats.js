const { config } = require("./config");
const genders = require("./genders.json");

/**
 * @typedef CompanyMember
 * @type {Object}
 * @property {string} [gender]
 * @property {string} [genderIdentity]
 * @property {string} [sex]
 * @property {string} [pronoun]
 */

/**
 * @typedef StatsType
 * @type {'binary' | 'full'}
 */

/** ========================================================= */

/**
 * @param {string} [sex]
 * @return {"male" | "female" | "other"}
 * @description
 * Parse provided sex variant in ("male", "female", "other") - format
 */
function parseSex(sex = "") {
  const isMale = genders.binary.male.sex.includes(sex.trim().toLowerCase());
  const isFemale = genders.binary.female.sex.includes(sex.trim().toLowerCase());

  if (isMale) return "male";
  if (isFemale) return "female";
  return "other";
}

/** --------------------------------------------------------- */

/**
 * @param {string} [pronoun]
 * @return {"male" | "female" | "other"}
 * @description
 * A person that has preferable pronoun may be identified as a male or a female. In other cases it's - "other"
 */
function pronounToSex(pronoun = "") {
  const isFemale = genders.binary.female.pronouns.includes(
    pronoun.trim().toLowerCase()
  );
  const isMale = genders.binary.male.pronouns.includes(
    pronoun.trim().toLowerCase()
  );

  if (isMale) return "male";
  if (isFemale) return "female";
  return "other";
}

/** --------------------------------------------------------- */

/**
 * @param {string} [genderIdentity]
 * @return {"male" | "female" | "other"}
 * @description
 * Some of the genders may be identified as a male or a female. In other cases it's - "other"
 */
function genderIdentityToSex(genderIdentity = "") {
  const isMale = genders.binary.male.genders.includes(
    genderIdentity.trim().toLowerCase()
  );
  const isFemale = genders.binary.female.genders.includes(
    genderIdentity.trim().toLowerCase()
  );

  if (isMale) return "male";
  if (isFemale) return "female";
  return "other";
}

/** --------------------------------------------------------- */

/**
 * @param {CompanyMember} member
 * @param {StatsType} type
 */
function getMemberGender(member, type) {
  const { sex, gender, genderIdentity, gender_identity, pronoun } = member;
  const identity = (
    genderIdentity ||
    gender_identity ||
    gender ||
    ""
  ).toLowerCase();

  switch (type) {
    case "binary": {
      if (sex) return parseSex(sex);
      if (pronoun) return pronounToSex(pronoun);
      return genderIdentityToSex(identity || gender);
    }
    case "full":
    default: {
      if (identity) {
        const category =
          Object.keys(genders.genderCategories).find((categoryKey) =>
            genders.genderCategories[categoryKey].includes(identity)
          ) || identity;
        return category;
      }
      return parseSex(sex) || pronounToSex(pronoun) || "other";
    }
  }
}

/** --------------------------------------------------------- */

/**
 * @param {CompanyMember[]} companyMembers
 * @param {{ mode: StatsType }} [options]
 * @returns {{
 * }}
 * @description
 *  binary - returns stats of 'male', 'female', 'other'; [DEFAULT]
 *
 *  full - returns stats of every gender identity;
 *
 *  P.S.
 *
 *  List if genders is based on Facebook list. Article -
 *
 *  https://blogs.illinois.edu/view/25/110232
 *
 *  List of gender pronouns is based on the article -
 *
 *  https://springfield.edu/gender-pronouns
 */
function getGenderStatsInternal(companyMembers = [], options = {}) {
  const mode = options.mode || "binary";
  const total = companyMembers.length;
  const stats = {};

  companyMembers.forEach((member) => {
    const gender = getMemberGender(member, mode);
    const count = stats[gender];

    stats[gender] = (count ?? 0) + 1;
  });

  const genderKeys = Object.keys(stats);

  const percentage = genderKeys.reduce((acc, genderKey) => {
    acc[genderKey] = ((stats[genderKey] / total) * 100).toFixed(2);
    return acc;
  }, {});

  const sorted = genderKeys.sort((a, b) => {
    if (stats[a] > stats[b]) return -1;
    if (stats[a] < stats[b]) return 1;
    return 0;
  });

  const majority = sorted.find((genderKey) => genderKey !== "other");
  const minority = sorted.reverse().find((genderKey) => genderKey !== "other");

  const hasGenderDisparity = total > 10 &&
    percentage[majority] - percentage[minority] >
    config.ALLOWED_GENDER_DIFFERENCE_PERCENT;

  return {
    total,
    count: stats,
    percentage,
    majority,
    minority,
    hasGenderDisparity,
  };
};

function getGenderStats(req, res) {
  const members = req.body?.members || [];

  if (!Array.isArray(members)) {
    res.status(400).send('Field "members" must be an array of objects');
    return;
  }

  const isChildrenValid = members.reduce((acc, c) => {
    if (!acc) return acc;
    return typeof c === "object" && !Array.isArray(c);
  }, true);

  if (!isChildrenValid) {
    res.status(400).send('Field "members" must be an array of objects');
    return;
  }

  if (!members.length) {
    res.status(400).send("No members provided");
    return;
  }

  const stats = getGenderStatsInternal(members, req.query);
  res.send(stats);
}

module.exports = { getGenderStats };
