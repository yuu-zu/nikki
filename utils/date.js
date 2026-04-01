function daysAgo(days) {
  const target = new Date();
  target.setDate(target.getDate() - days);
  return target;
}

function isExpired(dateString, days) {
  if (!dateString) {
    return false;
  }

  return new Date(dateString).getTime() < daysAgo(days).getTime();
}

module.exports = { daysAgo, isExpired };
