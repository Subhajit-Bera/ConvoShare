import { useEffect, useRef, useState, useCallback } from "react";

export const useInfiniteScrollTop = (
    containerRef,
    totalPages,
    page,
    setPage,
    newData,
    shouldReverse = false
) => {
    const [data, setData] = useState([]);
    const debounceTimer = useRef(null);

    const handleScroll = useCallback(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            if (!containerRef.current) return;
            const { scrollTop } = containerRef.current;
            const scrolledToTop = scrollTop === 0;
            if (scrolledToTop) {
                if (totalPages === page) return;
                setPage((oldPage) => oldPage + 1);
            }
        }, 200);
    }, [totalPages, page, containerRef, setPage]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) container.addEventListener("scroll", handleScroll);
        return () => {
            if (container) container.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll, containerRef]);

    useEffect(() => {
        let prevScrollHeight = 0;
        let prevScrollTop = 0;
        if (containerRef.current) {
            prevScrollHeight = containerRef.current.scrollHeight;
            prevScrollTop = containerRef.current.scrollTop;
        }
        if (newData && Array.isArray(newData)) {
            setData((oldData) => {
                const seen = new Set(oldData.map((i) => i._id));
                const newMessages = newData.filter((i) => !seen.has(i._id));
                if (shouldReverse) {
                    return [...newMessages.reverse(), ...oldData];
                } else {
                    return [...newMessages, ...oldData];
                }
            });
        }
        requestAnimationFrame(() => {
            if (containerRef.current) {
                const newScrollTop =
                    prevScrollTop + containerRef.current.scrollHeight - prevScrollHeight;
                containerRef.current.scrollTop = newScrollTop;
            }
        });
    }, [newData, containerRef, shouldReverse]);

    return { data, setData };
};