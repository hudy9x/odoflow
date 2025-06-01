import WorkflowDetail from '@/app/features/WorkflowDetail'

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  return <WorkflowDetail id={params.id} />
}
