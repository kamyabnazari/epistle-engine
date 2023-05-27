<script lang="ts">
	import IconPDF from '~icons/bxs/file-pdf';
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
					<button class="btn btn-sm btn-ghost">Actions</button>
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
