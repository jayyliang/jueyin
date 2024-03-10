import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const useQuery = () => {
  const [query, setQuery] = useState<Record<string, any>>({});
  const location = useLocation();
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const obj: Record<string, any> = {};
    for (const [key, value] of search.entries()) {
      obj[key] = value;
    }
    setQuery(obj);
  }, [location.search]);
  return query;
};

export default useQuery;
