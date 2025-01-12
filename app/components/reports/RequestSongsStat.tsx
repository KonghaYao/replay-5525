import { memo, useMemo } from 'react'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { AnimatedGroup } from '~/components/ui/animated-group'
import { selectedConcertDetailsAtom } from '~/stores/app'
import { concertListMap } from '~/lib/data'
import crown from '~/assets/crown.svg'
import type { Concert } from '~/data/types'
import { useFocusValueMap } from '~/hooks/useFocus'
import ConcertTitle from '~/components/ConcertTitle'

const allRequestSongListRaw = Object.values(concertListMap).reduce((acc, concert) => {
  return acc.concat(concert.requestSongList)
}, [] as string[])
const allRequestSongList = Array.from(new Set(allRequestSongListRaw))
const allRequestSongAmountMap = Object.fromEntries(
  Object.entries(
    allRequestSongListRaw.reduce(
      (acc, song) => {
        acc[song] = (acc[song] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  ).sort(([, a], [, b]) => b - a)
)

export const getPageData = (selectedConcertDetails: Concert[]) => {
  const listenedRequestSongListRaw = selectedConcertDetails.reduce((acc, concert) => {
    return acc.concat(concert.requestSongList)
  }, [] as string[])
  const listenedRequestSongList = Array.from(new Set(listenedRequestSongListRaw))
  const listenedRequestSongAmountMap = Object.fromEntries(
    Object.entries(
      listenedRequestSongListRaw.reduce(
        (acc, song) => {
          acc[song] = (acc[song] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )
  const maxRequestCount = Object.values(listenedRequestSongAmountMap)[0]
  const topRequestSongs = Object.entries(listenedRequestSongAmountMap)
    .filter(([, count]) => count === maxRequestCount)
    .map(([song]) => song)
  const top1RequestSong = topRequestSongs[0]
  const top1RequestSongConcertList = selectedConcertDetails.filter(
    (concert) => concert.requestSongList.includes(top1RequestSong) || concert.encoreSongList.includes(top1RequestSong)
  )

  return {
    listenedRequestSongList,
    listenedRequestSongAmountMap,
    listenedRequestSongRate: ~~((listenedRequestSongList.length / allRequestSongList.length) * 100),
    topRequestSongs,
    top1RequestSong,
    top1RequestSongConcertList,
  }
}

const RequestSongsStat: React.FC<{ focus: boolean }> = ({ focus }) => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const data = useMemo(() => getPageData(selectedConcertDetails), [selectedConcertDetails])
  console.log('RequestSongsStat', data)

  const animValue = useFocusValueMap(focus, () => ({
    listenedRequestSongAmount: data.listenedRequestSongList.length,
    listenedRequestSongRate: data.listenedRequestSongRate,
    top1RequestSongDateListLength: data.top1RequestSongConcertList.length,
  }))

  return (
    <div className="p-4">
      <div>
        <div className="text-report-normal">
          <span>今年一共听过</span>
          <AnimatedNumber className="text-report-large" value={animValue.listenedRequestSongAmount} />
          <span>首点歌</span>
        </div>
        <div className="text-report-normal">
          <span>覆盖今年点歌</span>
          <AnimatedNumber className="text-report-large" value={animValue.listenedRequestSongRate} />
          <span>%</span>
        </div>
        {data.top1RequestSongConcertList.length > 1 && (
          <>
            <div className="text-report-normal">
              <div>
                <span>在</span>
                <ConcertTitle className="text-report-large" concert={data.top1RequestSongConcertList[0]} />
                <span>第一次听到</span>
                <div className="text-report-large text-right">《{data.top1RequestSong}》</div>
              </div>
              <div>
                <span>并今年在随机曲目中听到</span>
                <AnimatedNumber className="text-report-large" value={animValue.top1RequestSongDateListLength} />
                <span>次，是专属于你的点歌 top1</span>
              </div>
            </div>
            {data.topRequestSongs.length > 1 && (
              <div className="text-report-normal">
                <span>除此之外，</span>
                {data.topRequestSongs
                  .filter((song) => song !== data.top1RequestSong)
                  .map((song) => (
                    <span key={song}>《{song}》</span>
                  ))}
                <span>也并列成为你的点歌 top1</span>
              </div>
            )}
          </>
        )}
      </div>
      <AnimatedGroup className="flex flex-wrap gap-2 my-8" preset="scale">
        {Object.keys(allRequestSongAmountMap).map((song) => {
          return (
            <div
              key={song}
              className={clsx([
                'relative px-3 py-1 rounded-full',
                'border-2 border-black',
                data.listenedRequestSongList.includes(song) ? 'bg-black text-white' : '',
              ])}
            >
              {song}
              {/* ({allListenedRequestSongAmountMap[song] || 0}/{allRequestSongAmountMap[song] || 0}) */}
              {data.topRequestSongs.includes(song) && (
                <img src={crown} alt="crown" className="absolute -top-6 -right-4 w-10 h-10 rotate-12" />
              )}
              {!data.topRequestSongs.includes(song) &&
                data.listenedRequestSongList.includes(song) &&
                data.listenedRequestSongAmountMap[song] === allRequestSongAmountMap[song] && (
                  <span className="absolute -top-3 -right-3 rotate-12 px-1 bg-white text-black rounded-full text-sm">
                    全勤
                  </span>
                )}
            </div>
          )
        })}
      </AnimatedGroup>
    </div>
  )
}

export default memo(RequestSongsStat)
