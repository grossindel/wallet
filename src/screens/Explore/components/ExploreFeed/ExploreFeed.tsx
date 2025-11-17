import React from 'react';
import { View } from 'react-native';

import type { ExploreContentRow } from '@/api/types';

import { ExploreContent, ExploreStaticContent } from '../ExploreContent';
import { ExploreRow } from '../ExploreRow';
import { ExploreHeroSkeleton, ExploreListSkeleton, ExploreMediumCardSkeleton, ExploreTextSkeleton } from '../ExploreSkeleton';

import type { ExploreFeedProps } from './ExploreFeed.types';

const skeletons = [ExploreHeroSkeleton, ExploreMediumCardSkeleton, ExploreListSkeleton, ExploreMediumCardSkeleton, ExploreTextSkeleton];

export const ExploreFeed = ({ feedData, loaded }: ExploreFeedProps) => {
  return (
    <View>
      {loaded && feedData.length > 0
        ? feedData.map((content: ExploreContentRow, index: number) => (
            <React.Fragment key={index}>
              <ExploreContent key={content.id} data={content} index={index} />
              <ExploreStaticContent key={content.id + 'static'} index={index} variant={content.variant} />
            </React.Fragment>
          ))
        : skeletons.map((Skeleton, index) => (
            <ExploreRow key={`skeleton_${index}`} index={index}>
              <Skeleton />
            </ExploreRow>
          ))}
    </View>
  );
};
