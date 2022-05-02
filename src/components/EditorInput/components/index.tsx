import { Editor, IAllProps } from '@tinymce/tinymce-react';
import imageService from 'services/imageService';

interface Props extends IAllProps {
	onChangeCustom: (field: string, value: string, shouldValidate?: boolean) => void;
	name: string;
	value: string;
}

const EditorInput: React.FC<Props> = ({ onChangeCustom, name, value, ...props }) => {
	return (
		<Editor
			{...props}
			onEditorChange={(a, editor) => {
				console.log(editor.getContent());
				onChangeCustom(name, editor.getContent());
				localStorage.setItem('editor_content', editor.getContent());
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
					'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview save print | insertfile image media template link anchor codesample | ltr rtl'
			}}
		/>
	);
};

export default EditorInput;
