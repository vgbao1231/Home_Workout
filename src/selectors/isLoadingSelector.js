import { createSelector } from '@reduxjs/toolkit';

// Selector aggregates loading status from slices
// As long as one is loading, it will show Loading...
export const selectIsLoading = createSelector(
    (state) => state.level.loading,
    (state) => state.muscle.loading,
    (state) => state.exercise.loading,
    (levelLoading, muscleLoading, exerciseLoading) => {
        return levelLoading || muscleLoading || exerciseLoading;
    },
);
