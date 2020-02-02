const SEMVAR = ['major', 'minor', 'patch']
  .includes((process.argv[2] || '').toLowerCase())
  ? process.argv[2].toLowerCase()
  : 'patch';

console.log(SEMVAR);
