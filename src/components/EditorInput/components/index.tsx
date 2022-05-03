import { Editor, IAllProps } from '@tinymce/tinymce-react';
import imageService from 'services/imageService';

interface Props extends IAllProps {
	onChangeCustom: (field: string, value: string, shouldValidate?: boolean) => void;
	name: string;
	value: string;
	tempName?: string;
}

const EditorInput: React.FC<Props> = ({ onChangeCustom, name, value, tempName, ...props }) => {
	return (
		<Editor
			{...props}
			onEditorChange={(a, editor) => {
				onChangeCustom(name, editor.getContent());
				tempName && localStorage.setItem(tempName, editor.getContent());
			}}
			apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
			value={value}
			init={{
				images_upload_handler: (blobInfo, progress): Promise<string> => {
					console.log(blobInfo, progress);
					return new Promise<string>((resolve, reject) => {
						imageService
							.upload({
								image: blobInfo
							})
							.then((response) => {
								return resolve(response.data.data.image_url);
							})
							.catch((error) => {
								return reject(error);
							})
							.finally(() => {});
					});
				},
				toolbar_sticky: true,
				height: 666,
				toolbar_mode: 'sliding',
				plugins: [
					'preview',
					'importcss',
					'searchreplace',
					'autolink',
					'autosave',
					'save',
					'directionality',
					'code',
					'visualblocks',
					'visualchars',
					'fullscreen',
					'image',
					'link',
					'media',
					'template',
					'codesample',
					'table',
					'charmap',
					'pagebreak',
					'nonbreaking',
					'anchor',
					'insertdatetime',
					'advlist',
					'lists',
					'wordcount',
					'help',
					'quickbars',
					'emoticons'
				],
				menubar: 'file edit view insert format tools table help',
				toolbar:
					'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl'
			}}
		/>
	);
};

export default EditorInput;
