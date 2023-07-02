export default {
	name: 'parent-name',
	children: [
		{
			name: 'document-example-name-1',
			document_topic: 'document-topic',
			children: [
				{
					name: 'document-chunk-topics',
					children: [
						{ name: 'introduction', value: 231 },
						{ name: 'conclusion', value: 52 },
						{ name: 'chunk-topic', value: 123 },
						{ name: 'chunk-topic', value: 323 }
					]
				}
			]
		},
		{
			name: 'document-example-name-2',
			document_topic: 'document-topic',
			children: [
				{
					name: 'document-chunk-topics',
					children: [
						{ name: 'introduction', value: 123 },
						{ name: 'conclusion', value: 231 },
						{ name: 'chunk-topic', value: 15 },
						{ name: 'chunk-topic', value: 1231 }
					]
				}
			]
		},
		{
			name: 'document-example-name-3',
			document_topic: 'document-topic',
			children: [
				{
					name: 'document-chunk-topics',
					children: [
						{ name: 'introduction', value: 123 },
						{ name: 'conclusion', value: 42 },
						{ name: 'chunk-topic', value: 542 }
					]
				}
			]
		}
	]
};
