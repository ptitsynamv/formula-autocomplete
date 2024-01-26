import { useQuery } from '@tanstack/react-query';

export const useHttp = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete').then(
        (res) => {
          return res.json();
        }
      ),
  });

  return { isPending, error, data };
};
