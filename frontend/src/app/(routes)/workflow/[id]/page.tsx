import WorkflowDetail from '@/app/features/WorkflowDetail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function WorkflowDetailPage({ params }: Props) {
  // Ensure params are resolved before rendering
  const { id } = await Promise.resolve(params)
  return <WorkflowDetail id={id} />
}
