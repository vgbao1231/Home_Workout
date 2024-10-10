import { createSelector } from '@reduxjs/toolkit';

// Selector aggregates loading status from slices
// As long as one is loading, it will show Loading...
export const isAnySliceLoading = createSelector(
    (state) => state.level.loading,
    (state) => state.muscle.loading,
    (levelLoading, muscleLoading) => {
        return levelLoading || muscleLoading;
    },
);
