
interface FilterCondition {
    field: string;
    operator: string;
    value: string;
}

export default function FilterConditionPreview({ conditions }: { conditions: FilterCondition[][] }) {
    if (!conditions.length) return null;

    return (
      <div className="space-y-1 max-h-[200px] overflow-y-auto bg-zinc-800 px-1 py-1 rounded-lg">
        {conditions.map((group, groupIndex) => (
          <div key={groupIndex} className="flex flex-wrap items-center gap-1">
            <div className="flex flex-wrap items-center gap-2  px-1 py-1 rounded-md text-xs bg-zinc-600">
              {group.map((condition, condIndex) => (
                <div key={`${condition.field}-${condIndex}`} className="flex flex-wrap items-center gap-2">
                  {condIndex > 0 && (
                    <span className="text-zinc-100 bg-zinc-900 px-1 py-0.5 rounded-sm text-[10px] font-medium">AND</span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-300 text-shadow-2xs">{condition.field}</span>
                    <span className="text-zinc-200 text-shadow-2xs">{condition.operator}</span>
                    <span className="font-medium text-green-400  text-shadow-2xs">{condition.value}</span>
                  </div>
                </div>
              ))}
            </div>
            {groupIndex < conditions.length - 1 && (
              <span className="text-zinc-200 px-2 text-xs font-medium">OR</span>
            )}
          </div>
        ))}
      </div>
    )
}