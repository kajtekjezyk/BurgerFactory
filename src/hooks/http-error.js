import {useState, useEffect, useCallback} from 'react'

export default httpClient => {
    const [error, setError] = useState(null);

        const deleteError = useCallback(() => {
            setError(null);
        }, [error]);

        const reqInterceptor = httpClient.interceptors.request.use(request => {
            deleteError();
            return request;
        });
        const respInterceptor = httpClient.interceptors.response.use(res=>res, error => {
            setError(error);
            return Promise.reject(error);
        });

        useEffect(()=> {
            return () => {
                httpClient.interceptors.request.eject(reqInterceptor);
                httpClient.interceptors.response.eject(respInterceptor);
            };
        }, [reqInterceptor, respInterceptor])

        return [error, deleteError];
}