import type { Attachment } from 'svelte/attachments';

export const draggable: Attachment = (element) => {
	const dragHandleElement = element.querySelector('[data-drag-handle]') ?? element;
	let isDragging = false;


	dragHandleElement.addEventListener('mousedown', (event) => {
		isDragging = true;
		event.preventDefault();
	});

	document.addEventListener('mousemove', (event) => {
		if (!isDragging) return;
		console.log(event.clientX, event.clientY);
	});

	document.addEventListener('mouseup', (event) => {
		if (isDragging) {
			isDragging = false;  
			console.log('Drag ended');
			event.preventDefault();
		}
	});
};
