import concurrently from 'concurrently';

// Ensure Windows System32 is always at the front of PATH for child processes
if (process.platform === 'win32') {
  const sys32 = 'C:\\Windows\\System32';
  process.env.PATH = `${sys32};${process.env.PATH || ''}`;
  process.env.Path = process.env.PATH;
}

const { result } = concurrently(
  [
    { command: 'npm --prefix backend run dev', name: 'api', prefixColor: 'blue' },
    { command: 'npm --prefix frontend run dev', name: 'web', prefixColor: 'green' }
  ],
  {
    killOthersOn: ['failure', 'success']
  }
);

result.then(
  () => process.exit(0),
  () => process.exit(1)
);
