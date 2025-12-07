import BaseService from "@/models/api/BaseService";
import PaginationResponse from "@/models/Pagination";
import { useState, useCallback, useEffect } from "react";
import errorResponse from "src/utils/errorResponse";

interface Props<T> {
    service: BaseService<T>,
    initFetch: boolean,
    autoFetch: boolean
    defaultPageSize?: number
}

export function useApiService<T extends object>({ service, initFetch, autoFetch, defaultPageSize = 6, }: Props<T>) {
    const [response, setResponse] = useState<PaginationResponse<T>>({ data: [], page: 0, size: 0, pages: 0, total: 10 });
    const [loadingList, setLoadingList] = useState(false);
    const [loadingItem, setLoadingItem] = useState(false);

    const [params, setParams] = useState<Record<string, unknown>>({
        search: '',
        page: 0,
        size: defaultPageSize,
    });

    const mutate = async <R>(
        fn: () => Promise<R>,
        setLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        setLoadingState(true);
        try {
            return await fn();
        } catch (err: unknown) {
            errorResponse(err)
        } finally {
            setLoadingState(false);
        }
    };

    const fetchList = useCallback(async () =>
        mutate(async () => {
            const res = await service.findAll({ params });
            setResponse(res);
            return res;
        }, setLoadingList),
        [service, params]
    );

    const fetchItem = useCallback(
        (id: number) =>
            mutate(async () => {
                const res = await service.findById(id);
                return res;
            }, setLoadingItem),
        [service]
    );

    const create = useCallback(
        async (payload: T) => mutate(async () => {
            const res = await service.create(payload);
            if (autoFetch) await fetchList();
            return res;
        }, setLoadingList),
        [service, autoFetch, fetchList]
    );

    const update = useCallback(
        async (id: number, payload: Partial<T>) => mutate(async () => {
            const res = await service.update(id, payload);
            if (autoFetch) await fetchList();
            return res;
        }, setLoadingList),
        [service, autoFetch, fetchList]
    );

    const remove = useCallback(
        async (id: number) => mutate(async () => {
            await service.delete(id);
            if (autoFetch) await fetchList();
        }, setLoadingList),
        [service, autoFetch, fetchList]
    );

    const setPage = useCallback((page: number) => {
        setParams(prev => prev.page !== page ? { ...prev, page } : prev);
    }, []);

    const setPageSize = useCallback((size: number) => {
        setParams(prev => prev.size !== size ? { ...prev, size } : prev);
    }, []);

    const setSearch = useCallback((search: string) => {
        setParams(prev => ({ ...prev, search }))
    }, [])

    useEffect(() => {
        if (initFetch) fetchList();
    }, [fetchList, initFetch]);

    return {
        response,
        loading: loadingList,
        loadingItem,
        params,
        setSearch,
        setPage,
        setPageSize,
        fetchList,
        fetchItem,
        create,
        update,
        remove,
    };
}
