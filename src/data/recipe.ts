type MarkdownInstance = import('astro').MarkdownInstance<any>;
// Which mode is the environment running in? https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
const { MODE } = import.meta.env;

export type Recipe = {
	title: string,
	slug: string,
	desc: string,
	author: string,
	timestamp: number,
	draft: boolean,
	date: string,
	file: URL,
	img: URL,
}

export function single(recipe: MarkdownInstance): Recipe {
	const slug = recipe.file.split('/').reverse()[0].replace('.md', '');
	return {
		...recipe.frontmatter,
		Content: recipe.Content,
		slug: slug,
		draft: recipe.file.split('/').reverse()[1] === 'drafts',
		timestamp: (new Date(recipe.frontmatter.date)).valueOf()
	}
}

export function published(recipes: MarkdownInstance[]): Recipe[] {
	return recipes
		.filter(recipe => recipe.frontmatter.title)
		.map(recipe => single(recipe))
		.filter(recipe => MODE === 'development' || !recipe.draft)
		.sort((a, b) => b.timestamp - a.timestamp)
}

export function getRSS(recipes: MarkdownInstance[]) {
	return {
		title: 'Food Bilum Recipe',
		description: 'Food Bilum Recipe Feed',
		stylesheet: true,
		customData: `<language>en-us</language>`,
		items: published(recipes).map((recipe: Recipe) => ({
			title: recipe.title,
			description: recipe.desc,
			link: recipe.slug,
			pubDate: recipe.date,
		})),
	}
}

