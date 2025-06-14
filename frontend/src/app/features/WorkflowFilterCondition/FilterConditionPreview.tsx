
interface FilterCondition {
    field: string;
    operator: string;
    value: string;
}

export default function FilterConditionPreview({ conditions }: { conditions: FilterCondition[][] }) {
    if (!conditions.length) return null;

    return (
      <div className="space-y-2 bg-zinc-800 px-2 py-1 rounded-md">
        {conditions.map((group, groupIndex) => (
          <div key={groupIndex} className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-2  px-2 py-1 rounded-md text-xs">
              {group.map((condition, condIndex) => (
                <div key={`${condition.field}-${condIndex}`} className="flex flex-wrap items-center gap-2">
                  {condIndex > 0 && (
                    <span className="text-zinc-100 text-xs font-medium">AND</span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-300">{condition.field}</span>
                    <span className="text-zinc-200">{condition.operator}</span>
                    <span className="font-medium text-green-400">{condition.value}</span>
                  </div>
                </div>
              ))}
            </div>
            {groupIndex < conditions.length - 1 && (
              <span className="text-zinc-200 text-xs font-medium">OR</span>
            )}
          </div>
        ))}
      </div>
    )
}