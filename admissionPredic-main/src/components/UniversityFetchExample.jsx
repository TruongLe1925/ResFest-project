import { useEffect, useState } from 'react';
import { fetchUniversities } from '../services/api';

/**
 * Minimal example: load universities with useState + useEffect and Axios-backed `fetchUniversities`.
 * Not wired into routes — copy the pattern into your own pages or use `usePredict` for the full flow.
 */
const UniversityFetchExample = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchUniversities();
        if (!cancelled) {
          setUniversities(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Request failed');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading universities…</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  return (
    <ul>
      {universities.map((u) => (
        <li key={u.name}>
          {u.name}
          {u.cutoff_score != null && ` — cutoff: ${u.cutoff_score}`}
        </li>
      ))}
    </ul>
  );
};

export default UniversityFetchExample;
