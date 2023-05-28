<script lang="ts">
	import IconPDF from '~icons/bxs/file-pdf';

	import IconDownload from '~icons/solar/download-square-outline';
	import IconBin from '~icons/solar/trash-bin-trash-outline';
	import IconRead from '~icons/solar/chat-unread-outline';

	const urlPDF =
		'https://raw.githubusercontent.com/vinodnimbalkar/svelte-pdf/369db2f9edbf5ab8c87184193e1404340729bb3a/public/sample.pdf';

	const downloadPdf = () => {
		window.open(urlPDF);
	};
</script>

<div class="w-full overflow-x-auto">
	<table class="table w-full">
		<!-- head -->
		<thead>
			<tr>
				<th>
					<label>
						<input type="checkbox" class="checkbox" />
					</label>
				</th>
				<th>Name</th>
				<th>Type</th>
				<th>Create Date</th>
				<th />
			</tr>
		</thead>
		<tbody>
			<tr>
				<th>
					<label>
						<input type="checkbox" class="checkbox" />
					</label>
				</th>
				<td>
					<div class="flex items-center space-x-3">
						<div class="mask mask-square flex h-10 w-10 items-center justify-center">
							<IconPDF style="font-size: x-large" class="text-primary" />
						</div>
						<div>
							<div class="font-bold">file-23.pdf</div>
						</div>
					</div>
				</td>
				<td>
					<span class="text-sm">Uploaded</span><br />
					<span class="badge badge-ghost badge-sm">PDF</span>
				</td>
				<td>13.05.2023</td>
				<th>
					<a href="/dashboard/file-read"
						><button class="btn btn-square btn-primary"
							><IconRead style="font-size: x-large;" /></button
						></a
					>
					<button class="btn btn-square btn-info" on:click={downloadPdf}
						><IconDownload style="font-size: x-large;" />
					</button>
					<button class="btn btn-square btn-warning"><IconBin style="font-size: x-large;" /></button
					>
				</th>
			</tr>
		</tbody>
		<!-- foot -->
		<tfoot>
			<tr>
				<th />
				<th>Name</th>
				<th>Type</th>
				<th>Create Date</th>
				<th />
			</tr>
		</tfoot>
	</table>
</div>
