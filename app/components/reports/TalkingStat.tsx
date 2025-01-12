import { memo, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { Carousel, CarouselContent, CarouselItem } from '~/components/ui/carousel'
import { selectedConcertDetailsAtom, selectedConcertDateTypeMapAtom } from '~/stores/app'
import {} from '~/components/ui/text-effect'
import { concertListMap } from '~/lib/data'
import type { Concert, ConcertSelectType } from '~/data/types'
import ConcertTitle from '../ConcertTitle'

const allTalkingMap: Record<string, string[]> = {
  '2024.05.18': [
    '从去年到今年，大家这一年是不是都平平安安，顺顺利利的。你们都好吗？摇滚区的你们好吗，看台区的你们好吗？二楼的，三楼的，最山顶的朋友？',
    '过去这一年五月天也去了好多的城市，发生了好多的事。我知道这一路上让大家担心了。在过去的这一年，对五月天来说也不能算得上是无风无雨，至少我们都过得平平安安，而且最重要的是今天在这里有你，有你们。对于五月天来说，你们就是我们的全世界。',
  ],
  '2024.05.21': [
    '我知道这阵子以来让大家担心了。这不是一段短短的日子，而是长达了半年不安、焦躁、不平，甚至你希望有一个人能够从天而降还给你正义，还给你正义。是那样一段漫长的岁月、漫长的等待。',
    '我知道，打开微博，打开小红书，好多的人给我鼓励，给我支持。但是其实对于我来说，我更希望给你们鼓励，给你们支持，告诉你们，怪兽没事、玛莎没事、石头没事、冠佑没事，我没事。',
  ],
  '2024.05.22': [
    '我忘记第一次来到鸟巢，然后我经纪人说这里可以装很多很多的人。我们在公司被宣布这件事情的时候，忘记是哪个团员，或者是我们五个人都一起说了一声，不要吧。因为如果到时候一个这么大的鸟巢里面空空的，那不是很丢脸吗？',
    '后来没多久鸟巢开卖了，五月天第一次来到这里。不但开了一场，而且还追加了一场；鸟巢不但没有空空的，而且两天都是全满的。那是十年前的事了。',
    '有时候有些险你不得不冒，有些路你不得不走。即便鸟巢是空空的，那么就让我对着空空的鸟巢的天空唱歌，我相信总会有听得懂五月天的人会听见。',
    '这世界的外面，在这鸟巢的外面有那么多的风风雨雨。我想那些你们也都听过了，也许到了今天你们也都听腻了，也许所有的流言会跟着我的背上一辈子。',
    '但是我知道，今天是鸟巢的第四天，还有第五天、第六天、第七天、第八天、第九天、第十天。就让我们的演奏，就让我们的音乐就让我们的舞台，就让我的声音来证明我的名我们的名字叫做五月天。',
  ],
  '2024.05.25': [
    '各位，我们回到2024年的5月25号了。这一趟时光之旅你们玩得开心吗？我们也很开心。在这条时光隧道上，我们补齐了过往25年所有五月天和你们记忆里面空缺的部分。我知道有些人一路风风雨雨陪伴五月天走过了25年，当然我知道那是极少数。',
    '如果我没有这趟旅程的话，我想五月天不会是今天的五月天。我们在台湾，我们出道，发行了第一张专辑，我们就开了一场大型的演唱会。当时走在路上会觉得好像全世界都应该认识我，但直到我们来到这里才知道，世界那么大，等待我们挑战的事物有那么多。',
    '',
  ],
  '2024.06.01': [
    '终于到了最后一夜，最后一段的最后一首歌了。维持十天的狂欢只会在五月天的人生里，在你我的自传里面也留下了难以忘怀的一笔。现在我想好好的跟你说声晚安，说声再见，我说声谢谢你们。',
    '别难过，因为我们都说好了，要一起唱到几岁？还很久嘛。也许到那一天，你们这些看起来像少女一样的女孩们，像少年一样的男孩们，到时候应该也是有点顶不住了吧。',
    '也许你们穿上最体面的服装告诉你的孙子孙女，告诉他们今天的你要出门。他们问你为什么呢，这么晚了，不在家吃晚餐吗？你会说，孩子，今天我有一个80岁的约定。',
    '也许我们会重新回到鸟巢，也许其实那时候你们早已遗忘五月天。但如果只要还有人想起这个约定的话，冠佑会回来，怪兽会回来，石头、玛莎会回来，我会回来。',
    '我想，我们是来自很普通家庭的五个很普通的小孩。和你们大多数的人一样，我们没有背景，没有天分，也没有太多的才华可以去挥霍。我也知道其实五月天这一路的遭遇，我想也可能你们都曾经遭遇过，被质疑，被否定。',
    '但是我想今天我们不需要在多说任何一句证明的话。十场鸟巢，我们抵达终点了。而且这一切，不是怪兽、石头、玛莎、冠佑，就可以做到的，因为没有你们，我们就不是五月天。',
  ],
  '2024.07.01': [
    '演唱会就快结束了，你相信吗？我也不相信，再回答我一次，现在时间是几点？',
    '相信我，我比你们更希望能够从头开始唱，其实不只是Energy，也包括了五月天，人生中有多少机会能够为你们唱、为你们跳、为你们付出所有。',
    '当然我也知道在很多事情以后，来到这里看五月天会变成一件好像有点难为情的事情，但是相信我。和你们走过了多少岁月，哪一种风雨不曾见过呢。',
    '只要你和五月天继续走着，我相信总有一天你的生命中最光荣的最难忘的一个印记，就是你曾经喜欢五月天。',
  ],
  '2024.07.02': [
    '转眼间今天演唱会已经到了尾声了。如果可以的话，现在我想要把的全场的灯都关上，好吗？很黑吗？也许此刻你的眼前看不到太多的东西，但是请你打开耳朵，你听到什么？',
    '你听到我和你说话的声音，听到了属于夏夜的钢琴，听到了深圳的风，听到你自己和你旁边的人的心跳。各位，欢迎你们，回到五月天的演唱会。',
    '我知道深圳是一个属于打工人的城市，也许你在深圳市工作，也许是念书，是生活。但我要告诉你，此时此刻来到五月天身边，回到五月天的身边，只是你难得可以松一口气，做自己的时间。',
  ],
  '2024.07.06': [
    '在今天晚上你们看得到深圳的星星吗？如果把灯关掉，也许就看得到。那么现在我们试试看就把全场的灯都关上。在此刻，这一片黑暗中，只有你，只有我。',
    '我看看，虽然我没有看到天上的星星，但为什么我看到体育场里满满、满满的星星。谢谢你们，现在请你往前、往左、往右、往后看。我想这会是我们在2024年里面看到的印象最深刻的星空。因为在今天，在这座体育场里面，每个星星都有一个自己的故事，自己的姓名。',
  ],
  '2024.07.07': [
    '终于到了最后一天，最后一个夜晚，最后一段的最后一首歌。转眼间，唱六个晚上，好像梦境，这一切过得好快好快。',
    '那我也知道，大人的世界已经没有了童谣。其实有时候我在想，虽然我们约定的那个未来是一直唱到80岁。但也许，有太多的也许，或许在某一天，你爱过的那些歌你再也不会听。你走入了生活，走入了工作，走入了家庭。也或许。在今天就是我们在人生中的最后一次交集。',
    '我当然希望我们的缘分还有10年、20年、30年甚至更多，但是今天晚上我想还是要好好的跟你们说一声，再见。',
  ],
  '2024.08.04': [
    '雨停了，但是五月天对你们的担心却无法停止下来，怕你们冷，怕你们感冒。答应我，等会演唱会结束的时候，记得赶快回家，赶快洗个热水澡，把自己照顾好好吗？',
    '因为我要说，如果没有你的话，那么台上的怪兽、冠佑、玛莎，还有没有来的石头，包括你，我们就不是五月天。',
  ],
  '2024.09.06': [
    '他们都说武汉好热，这几天你们觉得热吗？希望早点天气变得凉快吗？可有时候又觉得虽然热了一点，但是又好担心天气突然就变凉了，因为那代表夏天又要走了。活到这个岁数，才开始会想其实一生中能有几个夏天呢。如果可以的话，真希望夏天不要走，秋天冬天春天都不要走。',
    '昨天一来就吃了一碗热干面，但是我们的行程有点delay，吃到嘴里的时候，面已经稍微凉了。但是你们知道，吃到嘴里心还是热的。',
  ],
  '2024.09.11': [
    '这次回来武汉真的好热，好热好热。但是心里又想，如果每一年拥有一个最灿烂的盛夏的话，那这样子就会觉得，好像那一年没有真正留下深刻的记忆。所以前一天才说，好希望夏天晚一点走。没想到在今天秋凉的感觉已经来到武汉了。',
    '夏天要走了，五月天也要走了。但是这五个夜晚留下的回忆会写在五月天的自传里，要留下深刻的一页。',
  ],
  '2024.09.27': [
    '我们在那时候，其实我们五个人会一起跑出去吃火锅。怪兽、石头，你们还记得那时候我们一边吃着火锅，一边说的话吗？如果不记得那是正常的，因为我们辣到说不出话。我们只能灌着一瓶一瓶冰凉啤酒，一瓶一瓶冰凉汽水，幻想着在遥远的未来这个城市会不会有更多的人记得我们，会不会有更多的人来听我们唱歌。',
    '时间过去，当时的小伙子现在已经变成老伙子了，而你们是我们从来没幻想过的未来，你就在这里。',
  ],
  '2024.09.30': [
    '我永远记得我们有一次在春熙路开签售会，然后其实那时候我们走了很多城市，然后都觉得当时认识五月天的人是真的不多了。',
    '然后一直到我们来到成都，然后来到春熙路，然后那一天，一上来怪兽玛莎石头冠佑还有我都吓了一大跳，当时的舞台其实比我现在脚下站的圆形还要小，但是当时我看到的成都人感觉比今天还要多。',
    '从那次以后我们就对成都留下了很深的印象，大家对五月天的反应真的是又麻又辣。所以我们不是因为火锅而记得这座城市，我们是因为你们的热情，你们的直接，你们的善良而记住了成都。',
  ],
  '2024.10.04': [
    '有些城市在来的时候，总是悠闲得很不经意，就像成都。在五月天每次回来这里的时候总是觉得，啊，又回来了。但是每当回去的时候总是留下了不可磨灭的回忆与痕迹。',
    '在成都四场演唱会也第一次让我们体会了第一场的春天，第二场像夏天，第三场像秋天，而今天就像冬天。',
    '我们要说有些人看起来总是轻轻松松，笑脸迎人，就像今天晚上的你们穿着雨衣，脸上堆满着笑容，但是我知道在雨下的那张脸孔会是我们永远也忘不掉的回忆。谢谢你们，谢谢今天在这里陪我淋过一场雨，陪我唱过一场演唱会的你们。',
  ],
  '2024.11.10': [
    '演唱会唱了这么多场，其实很少遇到麦克风坏了没声音。但今天，在上海的第一天，它就发生了。',
    '我突然发现，有一天，如果五月天真的不能再唱了，那么我知道，你们都在，你们都在。如果是我要重写一次这首歌的话，我想我会说你们的真心我都听得到。',
  ],
  '2024.11.24': [
    '从5月的初夏一直到11月的深秋，每一场5525对我们来说都是一次在回忆里的冒险。在这里我要感谢在今天最后一个夜晚来到这里陪伴五月天的你。我想说其实无论是谁，生命中永远都会有你意想不到的风雨，有你意想不到的门槛。',
    '但我始终觉得，好像不必再多说什么。因为你们要和五月天一样，相信自己正在做正确的事，努力去当一个善良的人。如果你问我，当一个善良的人，老天会给我们什么礼物吗？我要告诉你，当一个善良的好人，本身就是一种礼物。',
    '在今晚，我们画下的不会是一个句点，而是一个美丽的逗号。这个逗号，有一些可爱的尾巴，像一个弯钩，钩着你我那条生命中再也不会断掉的缘分。晚安，我爱你们。',
  ],
}

export const shouldShowTalkingStat = (
  selectedConcertDetails: Concert[],
  selectedConcertDateTypeMap: Record<string, ConcertSelectType>
) => {
  return selectedConcertDetails
    .filter((concert) => selectedConcertDateTypeMap[concert.date] !== 'outdoor')
    .some((concert) => allTalkingMap[concert.date])
}

const getPageData = (
  selectedConcertDetails: Concert[],
  selectedConcertDateTypeMap: Record<string, ConcertSelectType>
) => {
  const talkingMap = selectedConcertDetails
    .filter((concert) => selectedConcertDateTypeMap[concert.date] !== 'outdoor')
    .reduce(
      (acc, concert) => {
        const talking = allTalkingMap[concert.date]
        if (talking) {
          acc[concert.date] = talking
        }
        return acc
      },
      {} as Record<string, string[]>
    )

  return {
    talkingMap,
  }
}

const TalkingStat: React.FC<{ focus: boolean }> = ({ focus }) => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = useMemo(
    () => getPageData(selectedConcertDetails, selectedConcertDateTypeMap),
    [selectedConcertDetails, selectedConcertDateTypeMap]
  )
  console.log('TalkingStat', data)

  return (
    <div className="h-full flex flex-col">
      <div className="text-report-normal mb-4 p-4">
        还记得
        <br />
        这些 Talking 吗？
      </div>
      <Carousel className="flex-1 overflow-hidden py-4 mb-8">
        <CarouselContent className="h-full" containerClassName="h-full">
          {Object.entries(data.talkingMap).map(([date, talking], index) => (
            <CarouselItem key={date} className="h-full basis-4/5 pl-8 last:pr-8 cursor-grab active:cursor-grabbing">
              <div className="h-full flex flex-col">
                <div className="text-report-normal">
                  <span>{date.replace(/^2024\./, '')}</span>
                  <ConcertTitle className="ml-2" concert={concertListMap[date]} />
                </div>
                <div className="border-2 flex-1 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] overflow-y-auto">
                  {talking.map((line, index) => (
                    <p key={line} className="text-xl leading-relaxed mb-3">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default memo(TalkingStat)
