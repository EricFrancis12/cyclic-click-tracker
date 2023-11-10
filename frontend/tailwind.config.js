/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'NavBar_backgroundColor': '#1e3948',
        'tab_active_backgroundColor': '#ffffff',
        'tab_inactive_backgroundColor': '#4b616d',
        'tab_inactive_backgroundColor_hover': '#00000070',
        'button_backgroundColor': '#17a689',
        'button_backgroundColor_hover': '#17a689',
        'LowerConrolPanel_backgroundColor': '#ebedef',
        'even_list_item': '#ffffff',
        'odd_list_item': '#e5e5e5',
        'list_item_border': '#f6f6f6',
        'data_table_row_hovered': '#e7f6f3'
      }
    },
  },
  plugins: []
}

