import WorkflowDetail from '@/app/features/Workflow/WorkflowDetail'

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  return <WorkflowDetail id={params.id} />
}
