import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

/**
 * Move one item of an array to a new position (returns a new array).
 */
export function movePhoto(list, from, to) {
    if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
        return list;
    }
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
}

/**
 * Photo grid that can be reordered by drag and drop (native HTML5 drag events)
 * or with the left/right buttons, which also work on touch screens where HTML5
 * drag is not available. The first photo is the main photo.
 *
 * Props:
 *  - items:        array of anything
 *  - getKey:       item => unique key
 *  - onReorder:    newItems => void
 *  - renderItem:   (item, index) => tile content (image + its own overlays)
 *  - showMain:     mark index 0 as "Main Photo" and offer "Set as Main" (default true)
 *  - disabled:     disable all reordering (e.g. while a request is in flight)
 *  - className:    grid classes
 *  - tileClassName: classes for each tile (aspect ratio, rounding)
 *  - trailing:     extra node rendered after the tiles (e.g. an upload button)
 */
export default function SortablePhotoGrid({
    items,
    getKey,
    onReorder,
    renderItem,
    showMain = true,
    disabled = false,
    className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4',
    tileClassName = 'aspect-video rounded-xl',
    trailing = null,
}) {
    const [dragIndex, setDragIndex] = useState(null);
    const [overIndex, setOverIndex] = useState(null);

    const move = (from, to) => {
        if (disabled) return;
        const next = movePhoto(items, from, to);
        if (next !== items) onReorder(next);
    };

    const resetDrag = () => {
        setDragIndex(null);
        setOverIndex(null);
    };

    const canReorder = !disabled && items.length > 1;

    return (
        <div className={className}>
            {items.map((item, index) => {
                const isMain = showMain && index === 0;
                const isDragging = dragIndex === index;
                const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;

                return (
                    <div
                        key={getKey(item, index)}
                        draggable={canReorder}
                        onDragStart={(e) => {
                            if (!canReorder) return;
                            setDragIndex(index);
                            e.dataTransfer.effectAllowed = 'move';
                            // Firefox will not start a drag without data.
                            try { e.dataTransfer.setData('text/plain', String(index)); } catch (_) { /* ignore */ }
                        }}
                        onDragEnter={(e) => {
                            if (dragIndex === null) return;
                            e.preventDefault();
                            setOverIndex(index);
                        }}
                        onDragOver={(e) => {
                            if (dragIndex === null) return;
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            if (overIndex !== index) setOverIndex(index);
                        }}
                        onDrop={(e) => {
                            if (dragIndex === null) return;
                            e.preventDefault();
                            const from = dragIndex;
                            resetDrag();
                            move(from, index);
                        }}
                        onDragEnd={resetDrag}
                        className={`relative overflow-hidden bg-gray-100 group select-none transition ${tileClassName} ${
                            canReorder ? 'cursor-grab active:cursor-grabbing' : ''
                        } ${isDragging ? 'opacity-40' : ''} ${isOver ? 'ring-4 ring-[#2BBBAD] ring-offset-2' : ''}`}
                    >
                        {renderItem(item, index)}

                        {isMain && (
                            <span className="absolute top-2 left-2 bg-[#2BBBAD] text-white text-xs px-2 py-1 rounded-full font-medium pointer-events-none z-10">
                                Main Photo
                            </span>
                        )}

                        {/* Reorder controls: always visible so they work on touch devices */}
                        {canReorder && (
                            <div className="absolute bottom-0 inset-x-0 z-10 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1.5 pt-4">
                                <button
                                    type="button"
                                    onClick={() => move(index, index - 1)}
                                    disabled={index === 0}
                                    className="p-1 rounded-full bg-white/90 text-gray-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move left"
                                    aria-label={`Move photo ${index + 1} left`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {showMain && index !== 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => move(index, 0)}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-gray-700 hover:bg-yellow-50 text-xs font-medium"
                                        title="Set as main photo"
                                        aria-label={`Set photo ${index + 1} as main photo`}
                                    >
                                        <Star className="w-3 h-3" />
                                        <span className="hidden sm:inline">Set as Main</span>
                                    </button>
                                ) : (
                                    <span className="text-[11px] text-white/90 font-medium">{index + 1}</span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => move(index, index + 1)}
                                    disabled={index === items.length - 1}
                                    className="p-1 rounded-full bg-white/90 text-gray-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move right"
                                    aria-label={`Move photo ${index + 1} right`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
            {trailing}
        </div>
    );
}
