              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border/50 pt-4">
                  {exercise.videoUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-border/50 bg-black">
                      <video
                        src={exercise.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        disablePictureInPicture
                        className="w-full max-h-48 object-contain"
                        preload="auto"
                      />
                    </div>
                  )}
                  {exercise.description && (
                    <p className="text-sm text-muted-foreground mb-4">{exercise.description}</p>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    {instructions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("exercises.instructions", "Instructions")}</h4>
                        <ol className="space-y-1.5">
                          {instructions.map((step, i) => (
                            <li key={i} className="flex gap-2 text-sm text-foreground">
                              <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                              {step}