import { useHttp } from '../hooks/http.hook';

const useDataService = () => {
  const { isPending, error, data } = useHttp();
  return { isPending, error, data };
};

export default useDataService;
