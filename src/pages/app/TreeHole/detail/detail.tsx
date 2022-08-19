import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { queryKey } from '@/shared/constant/queryKey'
import { getTreeholeDetailRequest } from '@/service/api/treehole'
import { SkeletonPostCard } from '@/components/skeleton/SkeletonPostCard'
import type { SxProps } from '@mui/material'
import { Card, Paper } from '@mui/material'
import { TreeholeCommentsList, TreeholeDetailBottomIcons } from '@/pages/app/TreeHole/detail/CommentList'
import Page from '@/components/page'
import { TreeholeListItem } from '@/pages/app/TreeHole/TreeholeListItem'
import type { CustomThemeOptions } from '@/theme/overrides'
import { EmptyData } from '@/components/EmptyData'
import type { AxiosError } from 'axios'
import { HoleNotFound } from '@/components/HoleNotFound'
import { CommentFab } from '@/pages/app/TreeHole/detail/CommentFab'

export default function TreeholeDetail() {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [isNotFound, setIsNotFound] = useState(false)

  const id = parseInt(params.id as string)

  const {
    data,
    isLoading,
    isSuccess,
  } = useQuery(
    [queryKey.treehole.detail, id],
    () => getTreeholeDetailRequest(id),
    {
      onError(err) {
        if ((err as AxiosError).response!.status === 404) {
          setIsNotFound(true)
        }
      },
      retry: false,
    },
  )

  return (
    <Page title={'树洞详情'}>
      {isLoading && (
          <Paper>
            <SkeletonPostCard />
          </Paper>
      )}
      {isSuccess && (
        <div className={'grid gap3'}>
          <Card className={'p4'} sx={{
            boxShadow: (theme: CustomThemeOptions) => theme.customShadows.card,
          } as SxProps}>
            <TreeholeListItem data={data} />
            <TreeholeDetailBottomIcons data={data}/>
          </Card>
          <Card className={`${data!.comments.length > 0 ? 'p4' : ''}`}>
            {
              data!.comments.length > 0
                ? <TreeholeCommentsList data={data} />
                : <EmptyData title={'暂时还没有评论哦, 快来一个评论吧~'} />
            }
          </Card>
        </div>
      )}
      {isNotFound && <HoleNotFound />}
      <CommentFab />
    </Page>
  )
}
