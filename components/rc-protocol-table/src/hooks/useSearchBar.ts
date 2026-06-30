import { useState, type Dispatch, type SetStateAction } from "react";

export interface UseSearchBarReturn {
    searchKeyword: string;
    setSearchKeyword: Dispatch<SetStateAction<string>>;
    searchMatchCount: number;
    setSearchMatchCount: Dispatch<SetStateAction<number>>;
    searchActiveIndex: number;
    setSearchActiveIndex: Dispatch<SetStateAction<number>>;
}

export function useSearchBar(): UseSearchBarReturn {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchMatchCount, setSearchMatchCount] = useState(0);
    const [searchActiveIndex, setSearchActiveIndex] = useState(0);

    return {
        searchKeyword,
        setSearchKeyword,
        searchMatchCount,
        setSearchMatchCount,
        searchActiveIndex,
        setSearchActiveIndex,
    };
}
