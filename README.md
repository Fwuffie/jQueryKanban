# jQueryKanban
A jQuery based 


## Requirements:

- jQuery 3.5.1
- jQueryUI 1.12.1

## Initialisation

jQuery kanban can be initialised like this;

	k = new Kanban(element, args);

#### Example

	<script>
	origin/master
	k = new Kanban($('#kanban'), {
		boards: [
					{"id": 'New', "title": 'New'},
					{"id": 'In-Progress', "title": 'In Progress'},
					{"id": 'Complete', "title": 'Complete'},
				],
		items: [
					{"boardId": 'New', "title": 'Cuddle Stuffies'},
					{"boardId": 'New', "title": 'Go For A Walk'},
					{"boardId": 'In-Progress', "title": 'Take a Nap'},
					{"boardId": 'Complete', "title": 'Feed Puppy'},
					{"boardId": 'In-Progress', "title": 'Water Plants'},
					{"boardId": 'New', "title": 'Bake a cake'}
				]
	});
	</script>
	
	<div id="kanban"></div>

## Args

The following is a list of args that can be passed to the kanban:

| Arg | Parameters | Description |
| --- | ---------- | ----------- |
| Header | Title |
| Paragraph | Text |